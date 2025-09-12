## confusion-metrics

A tiny library to compute confusion matrix metrics.

### Install

```bash
npm install confusion-metrics
```

### Usage

```ts
import { computeMetricsFromCounts, computeCountsFromLabels, computeMetricsFromLabels } from "confusion-metrics";

// From counts
const metrics = computeMetricsFromCounts({ tp: 70, fp: 10, fn: 20, tn: 100 });
console.log(metrics.accuracy);

// From label arrays
const predicted = [true, true, false, false];
const actual =    [true, false, true, false];

const counts = computeCountsFromLabels(predicted, actual);
const m = computeMetricsFromLabels(predicted, actual);
```

### Metrics

- True Positive (TP)
- True Negative (TN)
- False Positive (FP)
- False Negative (FN)
- True Positive Rate (TPR) / Recall
- False Positive Rate (FPR)
- False Negative Rate (FNR)
- True Negative Rate (TNR) / Specificity
- Prevalence
- Positive Predictive Value (PPV) / Precision
- Negative Predictive Value (NPV)
- Positive Likelihood Ratio (LR+)
- Negative Likelihood Ratio (LR-)
- Accuracy
- False Discovery Rate (FDR)
- False Omission Rate (FOR)
- Markedness (MK)
- DOR (Diagnostic Odds Ratio)
- Balanced Accuracy (BA)
- F1 score
- Fowlkes–Mallows (FM)
- MCC (Matthews correlation coefficient)
- Threat Score (TS) / CSI / Jaccard (positive class)

### API

```ts
computeCountsFromLabels<T>(predicted: T[], actual: T[], positiveValue?: T): ConfusionCounts
computeMetricsFromCounts(counts: ConfusionCounts): ConfusionMetrics
computeMetricsFromLabels<T>(predicted: T[], actual: T[], positiveValue?: T): ConfusionMetrics
```

### License

MIT © realog32

