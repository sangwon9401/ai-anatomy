// Real record of the offline 谚语 training run for zh (seed 1) that produced CHECKPOINTS.proverb:
// the loss on the whole corpus every 25 steps from step 0 to 1,500 (temperature-0.8 samples are in the scratch record).
// Used by the ch92 and ch94 scenes.

export const RUN_EVERY = 25;
export const RUN_CURVE = [6.24, 5.49, 5.3, 5.2, 5.16, 5.07, 5.04, 4.96, 4.67, 4.35, 3.97, 3.52, 3.12, 2.8, 2.54, 2.36, 2.23, 2.14, 2.03, 1.92, 1.87, 1.78, 1.72, 1.61, 1.49, 1.41, 1.32, 1.27, 1.24, 1.2, 1.17, 1.11, 1.06, 1.03, 1.04, 1.01, 0.98, 0.98, 0.96, 0.94, 0.94, 0.93, 0.92, 0.91, 0.9, 0.92, 0.89, 0.93, 0.9, 0.86, 0.86, 0.86, 0.9, 0.88, 0.86, 0.85, 0.85, 0.85, 0.84, 0.85, 0.83];

/** steps at which the loss first went below 2 and 1 */
export const RUN_REACH = { below2: 475, below1: 900 };
