// Real record of the offline English proverb training run (seed 1, BPE with 300 merges) that produced
// CHECKPOINTS.proverb: the loss on the whole corpus every 25 steps from step 0 to 1,500.
// Used by the ch92 and ch94 scenes.

export const RUN_EVERY = 25;
export const RUN_CURVE = [5.86, 4.3, 3.95, 3.88, 3.79, 3.53, 3.34, 3.26, 3.15, 3.11, 3.02, 2.94, 2.83, 2.77, 2.7, 2.66, 2.54, 2.48, 2.42, 2.39, 2.33, 2.28, 2.22, 2.14, 2.09, 2.03, 1.99, 1.9, 1.84, 1.77, 1.69, 1.59, 1.54, 1.47, 1.43, 1.38, 1.3, 1.24, 1.22, 1.17, 1.1, 1.09, 1.07, 1.02, 0.98, 0.97, 0.96, 0.94, 0.97, 0.95, 0.88, 0.88, 0.86, 0.85, 0.86, 0.8, 0.79, 0.84, 0.87, 0.8, 0.77];

/** steps at which the loss first went below 2 and 1 */
export const RUN_REACH = { below2: 650, below1: 1100 };
