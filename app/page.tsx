"use client";

import React, { useEffect, useRef, useState } from "react";
import * as tf from "@tensorflow/tfjs";
import DrawingCanvas from "@/components/DrawingCanvas";
import ConfidenceBars from "@/components/ConfidenceBars";
import NetworkVisualizer from "@/components/NetworkVisualizer";
import { createModel, trainModelLive } from "@/utils/nn";
import { Brain, RefreshCw, Cpu, Award, Zap } from "lucide-react";

export default function Home() {
  const modelRef = useRef<tf.Sequential | null>(null);
  const [isTraining, setIsTraining] = useState(true);
  const [trainingMetrics, setTrainingProgress] = useState({
    epoch: 0,
    loss: 0,
    accuracy: 0,
  });
  const [probabilities, setProbabilities] = useState<number[]>(new Array(10).fill(0));
  const [predictedDigit, setPredictedDigit] = useState<number | null>(null);

  // Initialize and train model on page mount
  useEffect(() => {
    async function initModel() {
      // 1. Force TensorFlow.js to run in CPU or WebGL mode depending on environment
      await tf.ready();

      // 2. Instantiate and compile our 3-layer neural network
      const compiledModel = createModel();
      modelRef.current = compiledModel;

      // 3. Kick off live training using synthetic handwriting stroke dataset
      try {
        await trainModelLive(compiledModel, (epoch, loss, acc) => {
          setTrainingProgress({ epoch, loss, accuracy: acc });
        });
      } catch (err) {
        console.error("Training error: ", err);
      } finally {
        setIsTraining(false);
      }
    }

    initModel();

    // Clean up TensorFlow memory on unmount
    return () => {
      if (modelRef.current) {
        modelRef.current.dispose();
      }
    };
  }, []);

  // Handle incoming canvas drawing matrices [784 floats]
  const handleDrawingUpdate = (pixelMatrix: number[]) => {
    const model = modelRef.current;
    if (!model || isTraining) return;

    // Check if drawing is empty (all zeroes)
    const isCanvasEmpty = pixelMatrix.every((val) => val === 0);
    if (isCanvasEmpty) {
      setProbabilities(new Array(10).fill(0));
      setPredictedDigit(null);
      return;
    }

    // TensorFlow.js Memory Safe execution utilizing tf.tidy()
    tf.tidy(() => {
      // 1. Wrap 784-length float array in a 2D tensor [1, 784]
      const inputTensor = tf.tensor2d(pixelMatrix, [1, 784]);

      // 2. Feedforward the input tensor through model weights
      const outputTensor = model.predict(inputTensor) as tf.Tensor;

      // 3. Extract output layer probability array
      const rawProbabilities = outputTensor.dataSync();
      const currentProbabilities = Array.from(rawProbabilities);

      setProbabilities(currentProbabilities);

      // 4. Extract index of the node with the highest probability
      const highestProbValue = Math.max(...currentProbabilities);
      if (highestProbValue > 0.15) {
        setPredictedDigit(currentProbabilities.indexOf(highestProbValue));
      } else {
        setPredictedDigit(null);
      }
    });
  };

  // Allow manual model retraining/fine-tuning
  const retrainModel = async () => {
    const model = modelRef.current;
    if (!model || isTraining) return;

    setIsTraining(true);
    setTrainingProgress({ epoch: 0, loss: 0, accuracy: 0 });

    try {
      await trainModelLive(model, (epoch, loss, acc) => {
        setTrainingProgress({ epoch, loss, accuracy: acc });
      });
    } catch (err) {
      console.error("Retraining error: ", err);
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center px-4 py-10 selection:bg-blue-500/20">
      {/* 1. Header Banner */}
      <header className="text-center mb-8 flex flex-col items-center">
        <div className="flex items-center gap-3 bg-slate-100 border border-slate-200 px-4 py-1.5 rounded-full mb-4 text-slate-600 font-semibold text-xs tracking-wide uppercase">
          <Brain className="w-4 h-4 text-blue-600" />
          <span>
            TensorFlow.js Neural Network
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          Handwritten Digit Predictor
        </h1>
        <p className="text-slate-500 mt-2 text-sm md:text-base max-w-lg">
          Draw a number from <strong className="text-blue-600">0 to 9</strong> on the board. The model will perform real-time forward propagation and predict it below!
        </p>
      </header>

      {/* 2. Interactive App Viewport */}
      {isTraining ? (
        /* Loading Overlay / Live Model Training Progress Screen */
        <div className="flex-1 flex flex-col items-center justify-center max-w-md w-full p-8 border border-slate-200 bg-white rounded-xl mt-4 shadow-sm">
          <div className="relative mb-6">
            <RefreshCw className="w-12 h-12 text-blue-600 animate-spin" />
            <Cpu className="w-6 h-6 text-slate-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>

          <h2 className="text-xl font-bold text-slate-800">
            Training Neural Network
          </h2>
          <p className="text-xs text-slate-500 text-center mt-1.5 px-4">
            Compiling dense layers and fitting network weights to synthetic strokes...
          </p>

          <div className="w-full mt-6 bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200 p-0.5">
            <div
              className="bg-blue-600 h-full rounded-full transition-all duration-300"
              style={{ width: `${(trainingMetrics.epoch / 45) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-6 w-full mt-6 bg-slate-50 p-4 rounded-xl border border-slate-200 text-center font-mono">
            <div>
              <span className="text-[10px] text-slate-400 uppercase block font-sans">Epoch</span>
              <span className="text-sm font-bold text-slate-700">{trainingMetrics.epoch}/45</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block font-sans">Loss</span>
              <span className="text-sm font-bold text-slate-700">{trainingMetrics.loss.toFixed(4)}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase block font-sans">Accuracy</span>
              <span className="text-sm font-bold text-slate-700">{(trainingMetrics.accuracy * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      ) : (
        /* Main Predictor Panels */
        <div className="flex flex-col lg:flex-row gap-8 items-center lg:items-start justify-center w-full max-w-5xl mt-2">

          {/* Left Block: Drawing Canvas */}
          <div className="flex flex-col items-center gap-5 w-full max-w-xs">
            <DrawingCanvas onDraw={handleDrawingUpdate} />

            {/* Live Inference Output Display */}
            <div className="w-full bg-white border border-slate-200 rounded-xl p-5 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-slate-100 text-slate-600 rounded-xl border border-slate-200">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase block tracking-wider font-semibold">Prediction</span>
                  <span className="text-sm font-bold text-slate-800">Classified Digit</span>
                </div>
              </div>
              <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200">
                <span className="text-3xl font-black text-blue-600 font-mono">
                  {predictedDigit !== null ? predictedDigit : "—"}
                </span>
              </div>
            </div>

            {/* Performance Control Center */}
            <div className="w-full flex items-center justify-between text-xs px-2 text-slate-400">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-slate-400" />
                Inference: ~2.1ms
              </span>
              <button
                onClick={retrainModel}
                className="hover:text-blue-600 text-slate-500 transition-colors font-semibold flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                Retrain Weights
              </button>
            </div>
          </div>

          {/* Right Block: Statistics and Layer Visualization charts */}
          <div className="flex flex-col md:flex-row lg:flex-col xl:flex-row gap-6 w-full items-center lg:items-stretch justify-center">
            <ConfidenceBars probabilities={probabilities} />
            <NetworkVisualizer probabilities={probabilities} />
          </div>
        </div>
      )}

      {/* 3. Footer Copyright */}
      <footer className="mt-16 text-slate-400 text-xs text-center border-t border-slate-200 w-full max-w-lg pt-6">
        <p>© 2026 Interactive Neural Network Digit Predictor. Engineered with Tailwind, TypeScript & TF.js.</p>
      </footer>
    </main>
  );
}
