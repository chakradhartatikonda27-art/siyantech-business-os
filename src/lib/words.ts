// Indian numbering system — Crore / Lakh / Thousand
// Verified: 160518 → "One Lakh Sixty Thousand Five Hundred Eighteen" ✓

const ONES = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten",
  "Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
const TENS = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];

const two = (n: number): string =>
  n < 20 ? ONES[n] : TENS[Math.floor(n/10)] + (n%10 ? " " + ONES[n%10] : "");

const three = (n: number): string =>
  (n > 99 ? ONES[Math.floor(n/100)] + " Hundred" + (n%100 ? " " : "") : "") +
  (n%100 ? two(n%100) : "");

export function numberToWordsIndian(num: number): string {
  num = Math.round(num);
  if (num === 0) return "Zero";
  let out = "";
  const crore = Math.floor(num / 1e7); num %= 1e7;
  const lakh = Math.floor(num / 1e5); num %= 1e5;
  const thousand = Math.floor(num / 1e3); num %= 1e3;
  if (crore) out += three(crore) + " Crore ";
  if (lakh) out += three(lakh) + " Lakh ";
  if (thousand) out += three(thousand) + " Thousand ";
  if (num) out += three(num);
  return out.trim();
}

export function amountInWords(num: number, style: "invoice" | "payslip" = "invoice"): string {
  const words = numberToWordsIndian(num);
  return style === "invoice"
    ? `Indian Rupees ${words} Only`
    : `Rupees ${words} Only`;
}

export function inr(n: number, decimals = 0): string {
  return "₹ " + n.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
