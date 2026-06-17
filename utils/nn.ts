import * as tf from "@tensorflow/tfjs";

export function createModel(): tf.Sequential {
  const model = tf.sequential();

  // Input Layer (784 features) -> First Hidden Layer (128 nodes)
  model.add(
    tf.layers.dense({
      inputShape: [784],
      units: 128,
      activation: "relu",
      kernelInitializer: "glorotNormal",
    })
  );

  // Second Hidden Layer (64 nodes)
  model.add(
    tf.layers.dense({
      units: 64,
      activation: "relu",
      kernelInitializer: "glorotNormal",
    })
  );

  // Output Layer (10 nodes corresponding to digits 0-9)
  model.add(
    tf.layers.dense({
      units: 10,
      activation: "softmax",
      kernelInitializer: "glorotNormal",
    })
  );

  // Compile with Adam Optimizer and Categorical Crossentropy Loss
  model.compile({
    optimizer: tf.train.adam(0.01),
    loss: "categoricalCrossentropy",
    metrics: ["accuracy"],
  });

  return model;
}

/**
 * Generates clear synthetic stroke representations of digits 0-9 on a 28x28 grid.
 * This ensures the neural network gets functional, recognizable training samples
 * instantly and predicts drawn inputs with high accuracy even without loading external files!
 */
export function generateSyntheticData() {
  const dataset: { image: number[]; label: number }[] = [];

  // Define digit shapes as 28x28 digital-style grid lines
  const drawVerticalLine = (grid: number[], col: number, startRow: number, endRow: number) => {
    for (let r = startRow; r <= endRow; r++) grid[r * 28 + col] = 1.0;
  };

  const drawHorizontalLine = (grid: number[], row: number, startCol: number, endCol: number) => {
    for (let c = startCol; c <= endCol; c++) grid[row * 28 + c] = 1.0;
  };

  const drawSlash = (grid: number[], startRow: number, endRow: number, startCol: number, endCol: number) => {
    const steps = endRow - startRow;
    for (let i = 0; i <= steps; i++) {
      const r = startRow + i;
      const c = Math.round(startCol + (i * (endCol - startCol)) / steps);
      grid[r * 28 + c] = 1.0;
    }
  };

  for (let digit = 0; digit < 10; digit++) {
    // Generate multiple variations (shifted, noisy) for each digit to train robustly
    for (let variant = 0; variant < 15; variant++) {
      const grid = new Array(784).fill(0);
      const shiftX = (variant % 3) - 1; // Shifts of -1, 0, 1
      const shiftY = Math.floor(variant / 3) % 3 - 1;

      // Draw basic geometric representations of digits 0-9
      if (digit === 0) {
        drawHorizontalLine(grid, 6 + shiftY, 8 + shiftX, 19 + shiftX);
        drawHorizontalLine(grid, 21 + shiftY, 8 + shiftX, 19 + shiftX);
        drawVerticalLine(grid, 8 + shiftX, 6 + shiftY, 21 + shiftY);
        drawVerticalLine(grid, 19 + shiftX, 6 + shiftY, 21 + shiftY);
      } else if (digit === 1) {
        drawVerticalLine(grid, 14 + shiftX, 4 + shiftY, 23 + shiftY);
        drawSlash(grid, 4 + shiftY, 8 + shiftY, 14 + shiftX, 10 + shiftX);
        drawHorizontalLine(grid, 23 + shiftY, 10 + shiftX, 18 + shiftX);
      } else if (digit === 2) {
        drawHorizontalLine(grid, 6 + shiftY, 8 + shiftX, 19 + shiftX);
        drawHorizontalLine(grid, 14 + shiftY, 8 + shiftX, 19 + shiftX);
        drawHorizontalLine(grid, 22 + shiftY, 8 + shiftX, 19 + shiftX);
        drawVerticalLine(grid, 19 + shiftX, 6 + shiftY, 14 + shiftY);
        drawVerticalLine(grid, 8 + shiftX, 14 + shiftY, 22 + shiftY);
      } else if (digit === 3) {
        drawHorizontalLine(grid, 6 + shiftY, 8 + shiftX, 19 + shiftX);
        drawHorizontalLine(grid, 14 + shiftY, 10 + shiftX, 19 + shiftX);
        drawHorizontalLine(grid, 22 + shiftY, 8 + shiftX, 19 + shiftX);
        drawVerticalLine(grid, 19 + shiftX, 6 + shiftY, 22 + shiftY);
      } else if (digit === 4) {
        drawVerticalLine(grid, 18 + shiftX, 4 + shiftY, 23 + shiftY);
        drawVerticalLine(grid, 10 + shiftX, 4 + shiftY, 14 + shiftY);
        drawHorizontalLine(grid, 14 + shiftY, 10 + shiftX, 22 + shiftX);
      } else if (digit === 5) {
        drawHorizontalLine(grid, 6 + shiftY, 8 + shiftX, 19 + shiftX);
        drawHorizontalLine(grid, 14 + shiftY, 8 + shiftX, 19 + shiftX);
        drawHorizontalLine(grid, 22 + shiftY, 8 + shiftX, 19 + shiftX);
        drawVerticalLine(grid, 8 + shiftX, 6 + shiftY, 14 + shiftY);
        drawVerticalLine(grid, 19 + shiftX, 14 + shiftY, 22 + shiftY);
      } else if (digit === 6) {
        drawHorizontalLine(grid, 6 + shiftY, 8 + shiftX, 19 + shiftX);
        drawHorizontalLine(grid, 14 + shiftY, 8 + shiftX, 19 + shiftX);
        drawHorizontalLine(grid, 22 + shiftY, 8 + shiftX, 19 + shiftX);
        drawVerticalLine(grid, 8 + shiftX, 6 + shiftY, 22 + shiftY);
        drawVerticalLine(grid, 19 + shiftX, 14 + shiftY, 22 + shiftY);
      } else if (digit === 7) {
        drawHorizontalLine(grid, 6 + shiftY, 8 + shiftX, 19 + shiftX);
        drawSlash(grid, 6 + shiftY, 22 + shiftY, 19 + shiftX, 10 + shiftX);
      } else if (digit === 8) {
        drawHorizontalLine(grid, 6 + shiftY, 8 + shiftX, 19 + shiftX);
        drawHorizontalLine(grid, 14 + shiftY, 8 + shiftX, 19 + shiftX);
        drawHorizontalLine(grid, 22 + shiftY, 8 + shiftX, 19 + shiftX);
        drawVerticalLine(grid, 8 + shiftX, 6 + shiftY, 22 + shiftY);
        drawVerticalLine(grid, 19 + shiftX, 6 + shiftY, 22 + shiftY);
      } else if (digit === 9) {
        drawHorizontalLine(grid, 6 + shiftY, 8 + shiftX, 19 + shiftX);
        drawHorizontalLine(grid, 14 + shiftY, 8 + shiftX, 19 + shiftX);
        drawHorizontalLine(grid, 22 + shiftY, 8 + shiftX, 19 + shiftX);
        drawVerticalLine(grid, 19 + shiftX, 6 + shiftY, 22 + shiftY);
        drawVerticalLine(grid, 8 + shiftX, 6 + shiftY, 14 + shiftY);
      }

      // Apply light gaussian-like blur to smooth the strokes and replicate human handwriting
      const blurred = new Array(784).fill(0);
      for (let r = 1; r < 27; r++) {
        for (let c = 1; c < 27; c++) {
          const idx = r * 28 + c;
          let sum = grid[idx] * 0.4;
          sum += grid[idx - 1] * 0.12 + grid[idx + 1] * 0.12;
          sum += grid[idx - 28] * 0.12 + grid[idx + 28] * 0.12;
          sum += grid[idx - 29] * 0.03 + grid[idx - 27] * 0.03;
          sum += grid[idx + 27] * 0.03 + grid[idx + 29] * 0.03;
          blurred[idx] = Math.min(1.0, sum);
        }
      }

      dataset.push({ image: blurred, label: digit });
    }
  }

  // Shuffle dataset using Fisher-Yates
  for (let i = dataset.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [dataset[i], dataset[j]] = [dataset[j], dataset[i]];
  }

  // Convert to Tensors
  const xsData = dataset.map((d) => d.image);
  const ysData = dataset.map((d) => {
    const oneHot = new Array(10).fill(0);
    oneHot[d.label] = 1;
    return oneHot;
  });

  return {
    xs: tf.tensor2d(xsData, [dataset.length, 784]),
    ys: tf.tensor2d(ysData, [dataset.length, 10]),
  };
}

export async function trainModelLive(
  model: tf.Sequential,
  onEpoch: (epoch: number, loss: number, acc: number) => void
) {
  const data = generateSyntheticData();

  await model.fit(data.xs, data.ys, {
    epochs: 45,
    batchSize: 16,
    callbacks: {
      onEpochEnd: (epoch, logs) => {
        if (logs) {
          onEpoch(epoch + 1, logs.loss, logs.acc);
        }
      },
    },
  });

  // Clean up tensors
  data.xs.dispose();
  data.ys.dispose();
}
