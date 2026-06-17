"use client";

import React, { useRef, useState, useEffect } from "react";
import { Trash2 } from "lucide-react";

interface DrawingCanvasProps {
  onDraw: (data: number[]) => void;
}

export default function DrawingCanvas({ onDraw }: DrawingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas resolution (280x280)
    canvas.width = 280;
    canvas.height = 280;

    // Fill background with black for clear pixel values
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 280, 280);

    // Initial silent render trigger
    triggerInference();
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.beginPath(); // Reset stroke path
    }
    triggerInference();
  };

  const getCoordinates = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    // Scale coordinates back to coordinate space if styled differently
    if ("touches" in e) {
      if (e.touches.length === 0) return { x: 0, y: 0 };
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top,
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Prevent scrolling when drawing on touch screens
    if (e.cancelable) {
      e.preventDefault();
    }

    const { x, y } = getCoordinates(e);

    ctx.lineWidth = 18; // MNIST-like thickness
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#ffffff"; // Draw with white color on black background

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);

    // Trigger real-time predictive stream as the user draws
    triggerInference();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, 280, 280);
    ctx.beginPath();

    // Reset predictions to zeroes
    onDraw(new Array(784).fill(0));
  };

  const triggerInference = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. Create a tiny off-screen canvas to downsample the 280x280 canvas to 28x28
    const tempCanvas = document.createElement("canvas");
    tempCanvas.width = 28;
    tempCanvas.height = 28;
    const tempCtx = tempCanvas.getContext("2d");
    if (!tempCtx) return;

    // 2. Draw active board on top of the 28x28 grid (leveraging browser image interpolation scaling)
    tempCtx.drawImage(canvas, 0, 0, 280, 280, 0, 0, 28, 28);

    // 3. Extract the image pixels
    const imgData = tempCtx.getImageData(0, 0, 28, 28);
    const pixels = imgData.data;

    // 4. Collect grayscale float values [0.0, 1.0] representing drawn luminance
    const grid: number[] = new Array(784);
    for (let i = 0; i < 784; i++) {
      const red = pixels[i * 4];
      const green = pixels[i * 4 + 1];
      const blue = pixels[i * 4 + 2];

      // Calculate luminance (grayscale weight) and normalize [0, 255] -> [0.0, 1.0]
      const luminance = (red + green + blue) / 3;
      grid[i] = luminance / 255;
    }

    onDraw(grid);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative p-1 bg-slate-800 rounded-xl border border-slate-700">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onMouseMove={draw}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchMove={draw}
          className="block bg-black rounded-lg cursor-crosshair touch-none select-none"
        />
      </div>

      <button
        onClick={clearCanvas}
        className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 active:bg-slate-900 text-slate-200 border border-slate-800 rounded-lg transition-colors font-medium"
      >
        <Trash2 className="w-4 h-4 text-rose-400" />
        Clear Board
      </button>
    </div>
  );
}
