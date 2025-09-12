/** Confusion matrix counts for TP, TN, FP, and FN */
export interface ConfusionCounts {
  /** True positives */
  tp: number;
  /** True negatives */
  tn: number;
  /** False positives */
  fp: number;
  /** False negatives */
  fn: number;
}

/** Confusion matrix metrics for TP, TN, FP, FN, TPR, FPR, FNR, TNR, PPV, NPV, LR+, LR-, ACC, FDR, FOR, MK, DOR, BA, F1, FM, MCC, TS, etc. */
export interface ConfusionMetrics extends ConfusionCounts {
  /** Total number of samples */
  total: number;
  /** Prevalence (P/total) */
  prevalence: number;
  /** True positive rate / Sensitivity / Recall */
  tpr: number;
  /** False positive rate / Fall-out */
  fpr: number;
  /** False negative rate / Miss rate */
  fnr: number;
  /** True negative rate / Specificity / Selectivity */
  tnr: number;
  /** Positive predictive value / Precision */
  ppv: number;
  /** Negative predictive value */
  npv: number;
  /** Positive likelihood ratio */  
  lrPlus: number;
  /** Negative likelihood ratio */
  lrMinus: number;
  /** Accuracy (tp + tn / total) */
  accuracy: number;
  /** False discovery rate */
  fdr: number;
  /** False omission rate */
  for: number;
  /** Markedness / MK / deltaP */
  markedness: number;
  /** Diagnostic odds ratio */
  dor: number;
  /** Balanced accuracy */  
  balancedAccuracy: number;
  /** F1 score */
  f1: number;
  /** Fowlkes–Mallows index */
  fm: number;
  /** Matthews correlation coefficient / Phi coefficient */
  mcc: number;
  /** Threat score / critical success index / Jaccard index */
  ts: number;
}

const divide = (numerator: number, denominator: number): number => {
  return denominator === 0 ? Number.NaN : numerator / denominator;
};

/**
 * Compute confusion counts from predicted and actual labels
 * @param predicted Predicted labels
 * @param actual Actual labels
 * @param positiveValue Positive value
 * @returns Confusion counts
 */
export function computeCountsFromLabels<T = number | boolean | string>(
  predicted: Array<T>,
  actual: Array<T>,
  positiveValue?: T
): ConfusionCounts {
  if (predicted.length !== actual.length) {
    throw new Error("predicted and actual must have the same length");
  }

  const isPositive = (value: unknown): boolean => {
    if (positiveValue !== undefined) {
      return value === positiveValue;
    }
    if (typeof value === "boolean") return value === true;
    if (typeof value === "number") return value === 1;
    if (typeof value === "string") return value === "1" || value.toLowerCase() === "true";
    return false;
  };

  let tp = 0;
  let tn = 0;
  let fp = 0;
  let fn = 0;

  for (let i = 0; i < predicted.length; i++) {
    const p = isPositive(predicted[i]);
    const a = isPositive(actual[i]);
    if (p && a) tp++;
    else if (p && !a) fp++;
    else if (!p && a) fn++;
    else tn++;
  }

  return { tp, tn, fp, fn };
}

/**
 * Compute confusion matrix metrics from actual and predicted condition counts.
 * @param counts Confusion counts
 * @returns Confusion metrics
 */
export function computeMetricsFromCounts(counts: ConfusionCounts): ConfusionMetrics {
  const { tp, tn, fp, fn } = counts;
  const positive = tp + fn;
  const negative = tn + fp;
  const total = positive + negative;

  const tpr = divide(tp, positive);
  const fnr = divide(fn, positive);
  const tnr = divide(tn, negative);
  const fpr = divide(fp, negative);
  const ppv = divide(tp, tp + fp);
  const npv = divide(tn, tn + fn);
  const prevalence = divide(positive, total);
  const accuracy = divide(tp + tn, total);
  const fdr = 1 - ppv;
  const _for = 1 - npv; // false omission rate
  const markedness = ppv + npv - 1;
  const lrPlus = divide(tpr, fpr);
  const lrMinus = divide(fnr, tnr);
  const dor = divide(tp * tn, fp * fn); // also (LR+) / (LR-)
  const balancedAccuracy = (tpr + tnr) / 2;
  const f1 = divide(2 * tp, 2 * tp + fp + fn);
  const fm = Math.sqrt(ppv * tpr);
  const mcc = divide(
    tp * tn - fp * fn,
    Math.sqrt((tp + fp) * (tp + fn) * (tn + fp) * (tn + fn))
  );
  const ts = divide(tp, tp + fp + fn);

  return {
    tp,
    tn,
    fp,
    fn,
    total,
    prevalence,
    tpr,
    fpr,
    fnr,
    tnr,
    ppv,
    npv,
    lrPlus,
    lrMinus,
    accuracy,
    fdr,
    for: _for,
    markedness,
    dor,
    balancedAccuracy,
    f1,
    fm,
    mcc,
    ts,
  };
}

/**
 * Compute confusion matrix metrics from predicted and actual labels
 * @param predicted Predicted labels
 * @param actual Actual labels
 * @param positiveValue Positive value
 * @returns Confusion metrics
 */
export function computeMetricsFromLabels<T = number | boolean | string>(
  predicted: Array<T>,
  actual: Array<T>,
  positiveValue?: T
): ConfusionMetrics {
  const counts = computeCountsFromLabels(predicted, actual, positiveValue);
  return computeMetricsFromCounts(counts);
}

export default {
  computeCountsFromLabels,
  computeMetricsFromCounts,
  computeMetricsFromLabels,
};
