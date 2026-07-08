export const aud = (n: number) =>
  n.toLocaleString("en-AU", { style: "currency", currency: "AUD" });

export const pct = (n: number, dp = 1) => `${n.toFixed(dp)}%`;

export const kg = (n: number, dp = 3) => `${n.toFixed(dp)} kg`;

export const num = (n: number, dp = 2) =>
  n % 1 === 0 ? String(n) : n.toFixed(dp);
