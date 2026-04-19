export interface Metric { name: string; value: number; timestamp: number; }
export class MonitorDash {
  private metrics: Metric[] = [];
  record(name: string, value: number) { this.metrics.push({ name, value, timestamp: Date.now() }); }
  getMetrics(name: string, from: number, to: number) { return this.metrics.filter(m => m.name === name && m.timestamp >= from && m.timestamp <= to); }
  alert(name: string, threshold: number, fn: Function) { setInterval(() => { const latest = this.metrics.filter(m => m.name === name).pop(); if (latest && latest.value > threshold) fn(latest); }, 5000); }
}
export default MonitorDash;
