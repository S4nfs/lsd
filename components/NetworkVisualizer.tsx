"use client";

import React from "react";

interface NetworkVisualizerProps {
  probabilities: number[];
}

export default function NetworkVisualizer({ probabilities }: NetworkVisualizerProps) {
  const maxIdx = probabilities.indexOf(Math.max(...probabilities));
  const hasInference = Math.max(...probabilities) > 0.15;

  // Define column coordinate spacing for a beautiful layered architecture
  const cols = [40, 150, 260, 380];
  const colLabels = ["Input (784)", "Dense (128)", "Dense (64)", "Output (10)"];

  // Define node Y coordinates for each column (subset of nodes drawn for visual clarity)
  const inputY = [40, 80, 120, 160, 200, 240];
  const hidden1Y = [60, 100, 140, 180, 220];
  const hidden2Y = [80, 120, 160, 200];
  const outputY = [25, 45, 65, 85, 105, 125, 145, 165, 185, 205, 225, 245].slice(1, 11); // 10 output nodes

  return (
    <div className="flex flex-col gap-4 w-full max-w-lg p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
      <div>
        <h3 className="text-lg font-bold text-slate-800">
          Neural Network Architecture
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Real-time forward propagation flow through model weights
        </p>
      </div>

      <div className="relative w-full aspect-[420/280] bg-slate-50 border border-slate-200 rounded-xl overflow-hidden p-2">
        <svg viewBox="0 0 420 280" className="w-full h-full">
          {/* Draw connecting synapses (connecting lines) */}
          <g className="synapses opacity-40">
            {/* Column 1 -> Column 2 */}
            {inputY.map((y1) =>
              hidden1Y.map((y2) => (
                <line
                  key={`syn1-${y1}-${y2}`}
                  x1={cols[0]}
                  y1={y1}
                  x2={cols[1]}
                  y2={y2}
                  stroke="#cbd5e1"
                  strokeWidth="0.5"
                />
              ))
            )}

            {/* Column 2 -> Column 3 */}
            {hidden1Y.map((y1) =>
              hidden2Y.map((y2) => (
                <line
                  key={`syn2-${y1}-${y2}`}
                  x1={cols[1]}
                  y1={y1}
                  x2={cols[2]}
                  y2={y2}
                  stroke="#cbd5e1"
                  strokeWidth="0.5"
                />
              ))
            )}

            {/* Column 3 -> Column 4 */}
            {hidden2Y.map((y1) =>
              outputY.map((y2, idx) => {
                const isActive = idx === maxIdx && hasInference;
                return (
                  <line
                    key={`syn3-${y1}-${y2}`}
                    x1={cols[2]}
                    y1={y1}
                    x2={cols[3]}
                    y2={y2}
                    stroke={isActive ? "#2563eb" : "#cbd5e1"}
                    strokeWidth={isActive ? "1.5" : "0.5"}
                    strokeDasharray={isActive ? "4, 4" : "none"}
                    className={isActive ? "animate-[dash_10s_linear_infinite]" : ""}
                  />
                );
              })
            )}
          </g>

          {/* Draw Synaptic Forward Flow Pulses */}
          {hasInference && (
            <g className="pulses">
              {/* Highlight connection stream to winning output digit */}
              {hidden2Y.map((y1, idx) => (
                <circle
                  key={`pulse-${idx}`}
                  r="2"
                  fill="#2563eb"
                >
                  <animateMotion
                    path={`M ${cols[2]},${y1} L ${cols[3]},${outputY[maxIdx]}`}
                    dur="1.2s"
                    repeatCount="indefinite"
                  />
                </circle>
              ))}
            </g>
          )}

          {/* Column 1 nodes (Inputs) */}
          <g className="column-1">
            {inputY.map((y, idx) => (
              <circle
                key={`in-${idx}`}
                cx={cols[0]}
                cy={y}
                r="4"
                fill="#64748b"
              />
            ))}
            {/* Draw gap indicator */}
            <text x={cols[0]} y="260" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">...</text>
          </g>

          {/* Column 2 nodes (Hidden 1) */}
          <g className="column-2">
            {hidden1Y.map((y, idx) => (
              <circle
                key={`h1-${idx}`}
                cx={cols[1]}
                cy={y}
                r="4"
                fill="#f1f5f9"
                stroke="#cbd5e1"
                strokeWidth="1.5"
              />
            ))}
            <text x={cols[1]} y="260" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">...</text>
          </g>

          {/* Column 3 nodes (Hidden 2) */}
          <g className="column-3">
            {hidden2Y.map((y, idx) => (
              <circle
                key={`h2-${idx}`}
                cx={cols[2]}
                cy={y}
                r="4"
                fill="#f1f5f9"
                stroke="#cbd5e1"
                strokeWidth="1.5"
              />
            ))}
            <text x={cols[2]} y="260" fill="#94a3b8" fontSize="10" textAnchor="middle" fontWeight="bold">...</text>
          </g>

          {/* Column 4 nodes (Outputs) */}
          <g className="column-4">
            {outputY.map((y, idx) => {
              const isActive = idx === maxIdx && hasInference;
              const opacity = hasInference ? Math.max(0.1, probabilities[idx]) : 1.0;

              return (
                <g key={`out-${idx}`}>
                  <circle
                    cx={cols[3]}
                    cy={y}
                    r={isActive ? "7" : "5"}
                    fill={isActive ? "#2563eb" : "#f1f5f9"}
                    stroke={isActive ? "#2563eb" : "#cbd5e1"}
                    strokeWidth={isActive ? "1.5" : "1"}
                    opacity={opacity}
                  />
                  <text
                    x={cols[3] + 16}
                    y={y + 3.5}
                    fontSize="9.5"
                    fontWeight="bold"
                    fill={isActive ? "#2563eb" : "#64748b"}
                    className="font-mono text-[9px]"
                  >
                    {idx}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Column Labels */}
          {colLabels.map((lbl, idx) => (
            <text
              key={`lbl-${idx}`}
              x={cols[idx]}
              y="18"
              fontSize="8.5"
              fontWeight="bold"
              fill="#64748b"
              textAnchor="middle"
              className="font-semibold select-none"
            >
              {lbl}
            </text>
          ))}
        </svg>

        {/* Global Keyframe CSS Styles inside the visual container */}
        <style jsx global>{`
          @keyframes dash {
            to {
              stroke-dashoffset: -40;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
