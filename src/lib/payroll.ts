// Payroll engine — decisions locked 12-Jun-2026:
// Basic 40% or 50% per employee, PF capped ₹1800, AP PT slabs, New Regime TDS FY26-27

export interface SalaryStructureInput {
  monthlyGross: number;
  basicPercent: number;
  hraPercent: number;
  conveyance: number;
  medicalLta: number;
  pfApplicable: boolean;
  pfCapped: boolean;
}

export interface AttendanceSummary {
  workingDays: number;
  lopDays: number;
}

export interface PayslipComputation {
  payableDays: number;
  basic: number;
  hra: number;
  conveyance: number;
  medicalLta: number;
  special: number;
  grossFull: number;
  grossEarned: number;
  lopDeduction: number;
  pfEmployee: number;
  pfEmployer: number;
  professionalTax: number;
  tds: number;
  totalDeductions: number;
  netPay: number;
}

const r0 = Math.round;

export function professionalTaxAP(monthlyGross: number): number {
  if (monthlyGross > 20000) return 200;
  if (monthlyGross >= 15001) return 150;
  return 0;
}

export function tdsNewRegimeMonthly(monthlyGross: number): number {
  const annualTaxable = monthlyGross * 12 - 75000;
  if (annualTaxable <= 1200000) return 0;
  const slabs: [number, number][] = [
    [400000, 0], [400000, 0.05], [400000, 0.10],
    [400000, 0.15], [400000, 0.20], [400000, 0.25],
    [Infinity, 0.30],
  ];
  let tax = 0, rem = annualTaxable;
  for (const [width, rate] of slabs) {
    const t = Math.min(rem, width);
    if (t <= 0) break;
    tax += t * rate;
    rem -= t;
  }
  return r0((tax * 1.04) / 12);
}

export function computePayslip(
  s: SalaryStructureInput,
  a: AttendanceSummary
): PayslipComputation {
  const payableDays = a.workingDays - a.lopDays;
  const factor = a.workingDays > 0 ? payableDays / a.workingDays : 0;

  const basicFull = (s.monthlyGross * s.basicPercent) / 100;
  const hraFull = (s.monthlyGross * s.hraPercent) / 100;
  const specialFull = s.monthlyGross - basicFull - hraFull - s.conveyance - s.medicalLta;

  const basic = r0(basicFull * factor);
  const hra = r0(hraFull * factor);
  const conveyance = r0(s.conveyance * factor);
  const medicalLta = r0(s.medicalLta * factor);
  const special = r0(specialFull * factor);
  const grossEarned = basic + hra + conveyance + medicalLta + special;
  const lopDeduction = r0(s.monthlyGross) - grossEarned;

  let pfEmployee = 0;
  if (s.pfApplicable) {
    pfEmployee = s.pfCapped
      ? Math.min(r0(basic * 0.12), 1800)
      : r0(basic * 0.12);
  }
  const pfEmployer = pfEmployee;
  const professionalTax = grossEarned > 0 ? professionalTaxAP(s.monthlyGross) : 0;
  const tds = tdsNewRegimeMonthly(s.monthlyGross);
  const totalDeductions = pfEmployee + professionalTax + tds;
  const netPay = grossEarned - totalDeductions;

  return {
    payableDays, basic, hra, conveyance, medicalLta, special,
    grossFull: r0(s.monthlyGross), grossEarned, lopDeduction,
    pfEmployee, pfEmployer, professionalTax, tds, totalDeductions, netPay,
  };
}
