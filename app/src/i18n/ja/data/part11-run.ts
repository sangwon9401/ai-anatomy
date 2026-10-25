// Real record of the offline ことわざ training run (ja corpus, seed 8) that produced CHECKPOINTS.proverb:
// the loss on the whole corpus every 25 steps from step 0 to 1,500, and lines the model wrote along the way
// (temperature 0.8). Used by the ch92 and ch94 scenes.

export const RUN_EVERY = 25;
export const RUN_CURVE = [5.85, 4.85, 4.53, 3.96, 3.4, 2.95, 2.65, 2.43, 2.24, 2.12, 2.01, 1.86, 1.73, 1.58, 1.48, 1.37, 1.29, 1.22, 1.13, 1.07, 0.99, 0.99, 0.96, 0.95, 0.92, 0.89, 0.89, 0.88, 0.9, 0.86, 0.86, 0.86, 0.85, 0.83, 0.83, 0.85, 0.83, 0.81, 0.79, 0.78, 0.79, 0.81, 0.79, 0.78, 0.76, 0.78, 0.77, 0.81, 0.78, 0.79, 0.77, 0.75, 0.76, 0.76, 0.76, 0.77, 0.78, 0.77, 0.72, 0.73, 0.73];

/** steps at which the loss first went below 2 and 1 */
export const RUN_REACH = { below2: 275, below1: 500 };
