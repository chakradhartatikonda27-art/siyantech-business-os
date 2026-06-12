// GST engine — verified against real SiyanTech invoice SGI/0002/26-27
// 1,30,800 + 4% SC + IGST 18% = 1,60,518 ✓

export const SELLER_STATE_CODE = "37"; // Andhra Pradesh

export interface LineItem {
  description: string;
  qty: number;
  rate: number;
  sacCode?: string;
}

export interface GstTotals {
  subtotal: number;
  serviceCharge: number;
  taxableAmount: number;
  supplyType: "INTRA" | "INTER";
  cgst: number;
  sgst: number;
  igst: number;
  totalGst: number;
  roundOff: number;
  grandTotal: number;
}

const r2 = (n: number) => Math.round(n * 100) / 100;

export function computeInvoiceTotals(
  items: LineItem[],
  placeOfSupply: string,
  opts: { serviceChargePct?: number; gstRate?: number } = {}
): GstTotals {
  const serviceChargePct = opts.serviceChargePct ?? 0;
  const gstRate = opts.gstRate ?? 18;

  const subtotal = r2(items.reduce((s, it) => s + it.qty * it.rate, 0));
  const serviceCharge = r2(subtotal * (serviceChargePct / 100));
  const taxableAmount = r2(subtotal + serviceCharge);

  const intra = placeOfSupply === SELLER_STATE_CODE;
  const supplyType: "INTRA" | "INTER" = intra ? "INTRA" : "INTER";

  const cgst = intra ? r2(taxableAmount * (gstRate / 2 / 100)) : 0;
  const sgst = intra ? r2(taxableAmount * (gstRate / 2 / 100)) : 0;
  const igst = intra ? 0 : r2(taxableAmount * (gstRate / 100));
  const totalGst = r2(cgst + sgst + igst);

  const raw = taxableAmount + totalGst;
  const grandTotal = Math.round(raw);
  const roundOff = r2(grandTotal - raw);

  return {
    subtotal, serviceCharge, taxableAmount,
    supplyType, cgst, sgst, igst, totalGst,
    roundOff, grandTotal,
  };
}
