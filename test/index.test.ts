import { describe, it, expect } from "vitest";
import { computeCountsFromLabels, computeMetricsFromCounts, computeMetricsFromLabels } from "../src/index";

describe("confusion-metrics", () => {
  it("computes counts from labels with boolean inputs", () => {
    const predicted = [true, true, false, false];
    const actual =    [true, false, true, false];
    const counts = computeCountsFromLabels(predicted, actual);
    expect(counts).toEqual({ tp: 1, fp: 1, fn: 1, tn: 1 });
  });

  it("computes metrics from counts", () => {
    const m = computeMetricsFromCounts({ tp: 70, fp: 10, fn: 20, tn: 100 });
    expect(m.total).toBe(200);
    expect(m.tpr).toBeCloseTo(0.7777777777, 6);
    expect(m.tnr).toBeCloseTo(0.9090909090, 6);
    expect(m.ppv).toBeCloseTo(0.875, 6);
    expect(m.npv).toBeCloseTo(0.8333333333, 6);
    expect(m.f1).toBeCloseTo(2 * 70 / (2 * 70 + 10 + 20), 10);
    expect(m.ts).toBeCloseTo(70 / (70 + 10 + 20), 10);
    expect(m.mcc).toBeGreaterThan(0.6);
  });

  it("computes metrics from labels with custom positive value", () => {
    const predicted = ["pos", "pos", "neg", "neg"];
    const actual =    ["pos", "neg", "pos", "neg"];
    const m = computeMetricsFromLabels(predicted, actual, "pos");
    expect(m.tp).toBe(1);
    expect(m.fp).toBe(1);
    expect(m.fn).toBe(1);
    expect(m.tn).toBe(1);
  });
});


