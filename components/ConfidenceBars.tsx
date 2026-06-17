"use client";

import React from "react";
import { motion } from "framer-motion";

interface ConfidenceBarsProps {
  probabilities: number[]; // Array of 10 floats between 0 and 1
}

export default function ConfidenceBars({ probabilities }: ConfidenceBarsProps) {
  // Find the index of the highest probability
  const maxIdx = probabilities.indexOf(Math.max(...probabilities));
  const hasInference = Math.max(...probabilities) > 0.15; // Only highlight if confidence > 15%

  return (
    <div className="flex flex-col gap-3.5 w-full max-w-sm p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-1">
        Model Probability Distribution
      </h3>

      <div className="flex flex-col gap-2">
        {probabilities.map((prob, digit) => {
          const isWinner = digit === maxIdx && hasInference;
          const percentage = (prob * 100).toFixed(1);

          return (
            <div key={digit} className="flex items-center gap-4">
              {/* Digit Label */}
              <span
                className={`w-4 text-sm font-bold transition-colors ${
                  isWinner ? "text-blue-600" : "text-slate-400"
                }`}
              >
                {digit}
              </span>

              {/* Graphical Bar */}
              <div className="flex-1 h-3.5 bg-slate-100 rounded overflow-hidden border border-slate-200">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  className={`h-full rounded-sm ${
                    isWinner
                      ? "bg-blue-600"
                      : "bg-slate-200"
                  }`}
                />
              </div>

              {/* Percentage Value */}
              <span
                className={`w-14 text-right text-xs font-mono transition-colors ${
                  isWinner ? "text-blue-600 font-bold" : "text-slate-500"
                }`}
              >
                {percentage}%
              </span>
            </div>
          );
          })}
      </div>
    </div>
  );
}
