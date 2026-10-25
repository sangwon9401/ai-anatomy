// Real record of the offline 속담 training run (seed 1) that produced CHECKPOINTS.proverb:
// the loss on the whole corpus every 25 steps from step 0 to 1,500, and lines the model wrote along the way
// (temperature 0.8). Used by the ch92 and ch94 scenes.

export const RUN_EVERY = 25;
export const RUN_CURVE = [5.82, 4.39, 4.0, 3.69, 3.54, 3.32, 3.11, 2.93, 2.74, 2.64, 2.53, 2.44, 2.36, 2.3, 2.25, 2.18, 2.13, 2.08, 2.02, 1.94, 1.88, 1.8, 1.72, 1.63, 1.56, 1.46, 1.37, 1.32, 1.28, 1.17, 1.15, 1.08, 1.02, 1.02, 0.96, 0.99, 0.93, 0.89, 0.87, 0.85, 0.84, 0.86, 0.87, 0.83, 0.78, 0.77, 0.76, 0.76, 0.75, 0.75, 0.75, 0.73, 0.77, 0.73, 0.73, 0.78, 0.71, 0.71, 0.68, 0.69, 0.68];

/** steps at which the loss first went below 2 and 1 */
export const RUN_REACH = { below2: 475, below1: 850 };
