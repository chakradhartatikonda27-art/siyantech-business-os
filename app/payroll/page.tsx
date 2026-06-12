"use client";
import { useState } from "react";

const EMPLOYEES = [
  {id:"1", empCode:"2701", fullName:"Chakradhar Tatikonda", designation:"Managing Director", monthlyGross:166667, basicPercent:40, hraPercent:20, conveyance:2000, medicalLta:12500, pfCapped:true, workingDays:26, lopDays:0},
  {id:"2", empCode:"2702", fullName:"Mohan Shesetty", designation:"Managing Director", monthlyGross:166667, basicPercent:40, hraPercent:20, conveyance:2000, medicalLta:12500, pfCapped:true, workingDays:26, lopDays:0},
  {id:"3", empCode:"2703", fullName:"Sri Sai Kadiyam", designation:"Sr. DevOps Engineer", monthlyGross:95000, basicPercent:40, hraPercent:20, conveyance:2000, medicalLta:5000, pfCapped:true, workingDays:26, lopDays:0},
  {id:"4", empCode:"2704", fullName:"Priya Vemula", designation:"Python Developer", monthlyGross:62000, basicPercent:50, hraPercent:25, conveyance:1500, medicalLta:0, pfCapped:true, workingDays:26, lopDays:1},
  {id:"5", empCode:"2705", fullName:"Rakesh Pashikanti", designation:"Finance Executive", monthlyGross:45000, basicPercent:50, hraPercent:25, conveyance:1500, medicalLta:0, pfCapped:true, workingDays:26, lopDays:0},
  {id:"6", empCode:"2706", fullName:"Anusha Rayudu", designation:"HR & Recruitment", monthlyGross:38000, basicPercent:50, hraPercent:25, conveyance:1500, medicalLta:0, pfCapped:true, workingDays:26, lopDays:0},
  {id:"7", empCode:"2707", fullName:"Kiran Bose", designation:"BPO Team Lead", monthlyGross:32000, basicPercent:50, hraPercent:25, conveyance:1500, medicalLta:0, pfCapped:true, workingDays:26, lopDays:2},
];

function ptAP(gross: number) {
  if (gross > 20000) return 200;
  if (gross >= 15001) return 150;
  return 0;
}

function tds(gross: number) {
  const annual = gross * 12 - 75000;
  if (annual <= 1200000) return 0;
  const slabs: [number, number][] = [
    [400000,0],[400000,.05],[400000,.10],[400000,.15],[400000,.20],[400000,.25],[Infinity,.30]
  ];
  let tax = 0, rem = annual;
  for (const [w, r] of slabs) {
    const t = Math.min(rem, w);
    if (t <= 0) break;
    tax += t * r; rem -= t;
  }
  return Math.round(tax * 1.04 / 12);
}

function compute(emp: typeof EMPLOYEES[0]) {
  const payable = emp.workingDays - emp.lopDays;
  const factor = payable / emp.workingDays;
  const basicFull = emp.monthlyGross * emp.basicPercent / 100;
  const hraFull = emp.monthlyGross * emp.hraPercent / 100;
  const specialFull = emp.monthlyGross - basicFull - hraFull - emp.conveyance - emp.medicalLta;
  const basic = Math.round(basicFull * factor);
  const hra = Math.round(hraFull * factor);
  const conv = Math.round(emp.conveyance * factor);
  const med = Math.round(emp.medicalLta * factor);
  const special = Math.round(specialFull * factor);
  const grossEarned = basic + hra + conv + med + special;
  const pf = Math.min(Math.round(basic * 0.12), 1800);
  const pt = ptAP(emp.monthlyGross);
  const tdAmt = tds(emp.monthlyGross);
  const net = grossEarned - pf - pt - tdAmt;
  return {payable, grossEarned, pf, pt, tds:tdAmt, net};
}

const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

export default function PayrollPage() {
  const [ran, setRan] = useState(false);
  const [running, setRunning] = useState(false);
  const [selected, setSelected] = useState<typeof EMPLOYEES[0] | null>(null);

  const run = () => {
    setRunning(true);
    setTimeout(() => { setRunning(false); setRan(true); }, 2000);
  };

  const results = EMPLOYEES.map(e => ({...e, ...compute(e)}));
  const totalNet = results.reduce((s, r) => s + r.net, 0);
  const totalGross = results.reduce((s, r) => s + r.grossEarned, 0);

  return (
    <div style={{minHeight:"100vh", background:"#F5F3FA", fontFamily:"sans-serif"}}>
      {/* Top bar */}
      <div style={{background:"#fff", borderBottom:"1px solid #E2D8EE", padding:"14px 28px", display:"flex", alignItems:"center", gap:"16px"}}>
        <div style={{width:"36px", height:"36px", borderRadius:"10px", background:"linear-gradient(135deg,#6F32B3,#B770CE)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:"800", fontSize:"18px"}}>S</div>
        <div>
          <div style={{fontWeight:"700", fontSize:"16px", color:"#1E1428"}}>SiyanTech Business OS</div>
          <div style={{fontSize:"11px", color:"#5C5470"}}>SiyanTech Global Innovations Pvt. Ltd.</div>
        </div>
        <div style={{marginLeft:"auto"}}>
          <a href="/dashboard" style={{fontSize:"13px", color:"#6F32B3", textDecoration:"none"}}>← Dashboard</a>
        </div>
      </div>

      <div style={{display:"flex"}}>
        {/* Sidebar */}
        <div style={{width:"220px", background:"#2C1463", minHeight:"calc(100vh - 65px)", padding:"20px 12px"}}>
          {[
            {icon:"◧", label:"Dashboard", href:"/dashboard"},
            {icon:"⏱", label:"Attendance", href:"/attendance"},
            {icon:"✈", label:"Leaves", href:"/leaves"},
            {icon:"☰", label:"Employees", href:"/employees"},
            {icon:"✉", label:"HR Letters", href:"/hr-letters"},
            {icon:"◈", label:"Leads", href:"/leads"},
            {icon:"₹", label:"Invoices", href:"/invoices"},
            {icon:"▤", label:"Expenses", href:"/expenses"},
            {icon:"▦", label:"Payroll", href:"/payroll", active:true},
          ].map((item) => (
            <a key={item.href} href={item.href}
              style={{display:"flex", alignItems:"center", gap:"10px", padding:"10px 12px", borderRadius:"9px", marginBottom:"4px", color:item.active?"#fff":"rgba(255,255,255,0.7)", background:item.active?"rgba(255,255,255,0.15)":"transparent", textDecoration:"none", fontSize:"13.5px", fontWeight:item.active?"600":"400"}}>
              <span>{item.icon}</span><span>{item.label}</span>
            </a>
          ))}
        </div>

        {/* Main */}
        <div style={{flex:1, padding:"28px"}}>
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"20px"}}>
            <div>
              <h2 style={{fontSize:"22px", fontWeight:"700", color:"#1E1428"}}>Payroll — June 2026</h2>
              <p style={{fontSize:"13px", color:"#5C5470", marginTop:"2px"}}>7 employees · attendance pulled automatically · PF capped ₹1,800 · New Regime TDS</p>
            </div>
            {!ran ? (
              <button onClick={run} disabled={running}
                style={{background:"linear-gradient(135deg,#6F32B3,#B770CE)", color:"#fff", border:"none", borderRadius:"10px", padding:"12px 24px", fontSize:"14px", fontWeight:"600", cursor:"pointer", opacity:running?0.7:1}}>
                {running ? "Computing..." : "▦ Run Payroll"}
              </button>
            ) : (
              <div style={{background:"#E3F6EE", color:"#0E9F6E", padding:"10px 18px", borderRadius:"10px", fontWeight:"600", fontSize:"13.5px"}}>
                ✓ Payroll finalized
              </div>
            )}
          </div>

          {/* Summary cards */}
          {ran && (
            <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"16px", marginBottom:"24px"}}>
              {[
                {label:"Total Gross", value:inr(totalGross), color:"#6F32B3"},
                {label:"Total Net Pay", value:inr(totalNet), color:"#0E9F6E"},
                {label:"Total PF (Employer)", value:inr(results.reduce((s,r)=>s+r.pf,0)), color:"#C77B0A"},
                {label:"Total TDS", value:inr(results.reduce((s,r)=>s+r.tds,0)), color:"#D6455D"},
              ].map(k => (
                <div key={k.label} style={{background:"#fff", border:"1px solid #E2D8EE", borderRadius:"14px", padding:"18px"}}>
                  <div style={{fontSize:"11px", fontWeight:"600", color:"#5C5470", textTransform:"uppercase", letterSpacing:"0.04em"}}>{k.label}</div>
                  <div style={{fontSize:"22px", fontWeight:"800", color:k.color, marginTop:"6px"}}>{k.value}</div>
                </div>
              ))}
            </div>
          )}

          {/* Payroll table */}
          {ran && (
            <div style={{background:"#fff", border:"1px solid #E2D8EE", borderRadius:"14px", overflow:"hidden"}}>
              <table style={{width:"100%", borderCollapse:"collapse", fontSize:"13px"}}>
                <thead>
                  <tr style={{background:"#7B3CC4"}}>
                    {["Employee","Payable Days","Gross Earned","PF","Prof. Tax","TDS","Net Pay",""].map(h => (
                      <th key={h} style={{padding:"11px 14px", textAlign:"left", color:"#fff", fontSize:"11px", fontWeight:"600", letterSpacing:"0.07em", textTransform:"uppercase"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={r.id} style={{borderBottom:"1px solid #E2D8EE", background:i%2===0?"#fff":"#F8F2FB"}}>
                      <td style={{padding:"12px 14px"}}>
                        <div style={{fontWeight:"600", color:"#1E1428"}}>{r.fullName}</div>
                        <div style={{fontSize:"11px", color:"#5C5470"}}>{r.designation}</div>
                      </td>
                      <td style={{padding:"12px 14px"}}>
                        {r.payable}
                        {r.lopDays > 0 && <span style={{marginLeft:"6px", background:"#FBE7EB", color:"#D6455D", padding:"2px 7px", borderRadius:"99px", fontSize:"10.5px", fontWeight:"600"}}>{r.lopDays} LOP</span>}
                      </td>
                      <td style={{padding:"12px 14px", fontWeight:"600"}}>{inr(r.grossEarned)}</td>
                      <td style={{padding:"12px 14px", color:"#5C5470"}}>{inr(r.pf)}</td>
                      <td style={{padding:"12px 14px", color:"#5C5470"}}>{inr(r.pt)}</td>
                      <td style={{padding:"12px 14px", color:"#5C5470"}}>{inr(r.tds)}</td>
                      <td style={{padding:"12px 14px", fontWeight:"700", color:"#0E9F6E", fontSize:"14px"}}>{inr(r.net)}</td>
                      <td style={{padding:"12px 14px"}}>
                        <button onClick={() => setSelected(r)}
                          style={{background:"#F7F4FE", color:"#6F32B3", border:"none", borderRadius:"7px", padding:"6px 12px", fontSize:"12px", fontWeight:"600", cursor:"pointer"}}>
                          Payslip
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!ran && !running && (
            <div style={{background:"#fff", border:"1px solid #E2D8EE", borderRadius:"14px", padding:"60px", textAlign:"center"}}>
              <div style={{fontSize:"48px", marginBottom:"16px"}}>▦</div>
              <div style={{fontSize:"16px", fontWeight:"600", color:"#1E1428", marginBottom:"8px"}}>Ready to run June 2026 payroll</div>
              <div style={{fontSize:"13px", color:"#5C5470"}}>Attendance is pulled automatically · LOP days shown in red · All deductions computed per employee</div>
            </div>
          )}

          {running && (
            <div style={{background:"#fff", border:"1px solid #E2D8EE", borderRadius:"14px", padding:"60px", textAlign:"center"}}>
              <div style={{fontSize:"13px", color:"#5C5470", lineHeight:"2"}}>
                ⏳ Pulling June attendance records...<br/>
                ⏳ Computing LOP deductions...<br/>
                ⏳ Calculating PF (capped ₹1,800)...<br/>
                ⏳ Applying AP Professional Tax...<br/>
                ⏳ Computing New Regime TDS FY 2026-27...<br/>
                ⏳ Generating 7 payslips...
              </div>
            </div>
          )}

          {/* Payslip modal */}
          {selected && (
            <div style={{position:"fixed", inset:0, background:"rgba(33,26,53,.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:50, padding:"20px"}}>
              <div style={{background:"#fff", borderRadius:"16px", width:"600px", maxWidth:"95vw", maxHeight:"90vh", overflowY:"auto", overflow:"hidden"}}>
                {/* Payslip header */}
                <div style={{background:"linear-gradient(135deg,#6F32B3,#B770CE)", color:"#fff", padding:"20px 28px", display:"flex", justifyContent:"space-between", alignItems:"flex-start"}}>
                  <div>
                    <div style={{fontWeight:"800", fontSize:"16px"}}>SiyanTech Global Innovations Pvt. Ltd.</div>
                    <div style={{fontSize:"10px", opacity:.85, marginTop:"4px"}}>Visakhapatnam, Andhra Pradesh · ISO 9001:2015 · ISO/IEC 27001:2022</div>
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontWeight:"800", fontSize:"18px", letterSpacing:".04em"}}>SALARY SLIP</div>
                    <div style={{fontSize:"11px", opacity:.85}}>June 2026 · 01-Jun to 30-Jun-2026</div>
                  </div>
                </div>

                <div style={{padding:"20px 28px", fontSize:"12.5px"}}>
                  {/* Employee info */}
                  <table style={{width:"100%", borderCollapse:"collapse", marginBottom:"16px", fontSize:"12px"}}>
                    <tbody>
                      {[
                        ["Employee Name", selected.fullName, "Employee ID", selected.empCode],
                        ["Designation", selected.designation, "Working Days", `${selected.payable} / ${selected.workingDays}`],
                      ].map((row, i) => (
                        <tr key={i}>
                          <td style={{padding:"6px 10px", background:"#F8F2FB", color:"#5C5470", width:"20%"}}>{row[0]}</td>
                          <td style={{padding:"6px 10px", border:"1px solid #E2D8EE", fontWeight:"600", width:"30%"}}>{row[1]}</td>
                          <td style={{padding:"6px 10px", background:"#F8F2FB", color:"#5C5470", width:"20%"}}>{row[2]}</td>
                          <td style={{padding:"6px 10px", border:"1px solid #E2D8EE", fontWeight:"600", width:"30%"}}>{row[3]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Earnings & Deductions */}
                  <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"16px", marginBottom:"14px"}}>
                    <table style={{borderCollapse:"collapse", fontSize:"12px"}}>
                      <thead><tr style={{background:"#7B3CC4"}}><th style={{padding:"7px 10px", color:"#fff", textAlign:"left", fontSize:"10px"}}>Earnings</th><th style={{padding:"7px 10px", color:"#fff", textAlign:"right", fontSize:"10px"}}>Amount (₹)</th></tr></thead>
                      <tbody>
                        {[
                          [`Basic (${selected.basicPercent}%)`, Math.round(selected.monthlyGross*selected.basicPercent/100*selected.payable/selected.workingDays)],
                          [`HRA (${selected.hraPercent}%)`, Math.round(selected.monthlyGross*selected.hraPercent/100*selected.payable/selected.workingDays)],
                          ["Conveyance", Math.round(selected.conveyance*selected.payable/selected.workingDays)],
                          ["Medical + LTA", Math.round(selected.medicalLta*selected.payable/selected.workingDays)],
                          ["Special Allowance", selected.grossEarned - Math.round(selected.monthlyGross*selected.basicPercent/100*selected.payable/selected.workingDays) - Math.round(selected.monthlyGross*selected.hraPercent/100*selected.payable/selected.workingDays) - Math.round(selected.conveyance*selected.payable/selected.workingDays) - Math.round(selected.medicalLta*selected.payable/selected.workingDays)],
                        ].map(([l,v]) => (
                          <tr key={l} style={{borderBottom:"1px solid #E2D8EE"}}>
                            <td style={{padding:"6px 10px"}}>{l}</td>
                            <td style={{padding:"6px 10px", textAlign:"right"}}>{Number(v).toLocaleString("en-IN")}</td>
                          </tr>
                        ))}
                        <tr style={{background:"#F8F2FB"}}>
                          <td style={{padding:"6px 10px", fontWeight:"700"}}>Gross Earnings</td>
                          <td style={{padding:"6px 10px", textAlign:"right", fontWeight:"700"}}>{selected.grossEarned.toLocaleString("en-IN")}</td>
                        </tr>
                      </tbody>
                    </table>
                    <table style={{borderCollapse:"collapse", fontSize:"12px", alignSelf:"flex-start"}}>
                      <thead><tr style={{background:"#7B3CC4"}}><th style={{padding:"7px 10px", color:"#fff", textAlign:"left", fontSize:"10px"}}>Deductions</th><th style={{padding:"7px 10px", color:"#fff", textAlign:"right", fontSize:"10px"}}>Amount (₹)</th></tr></thead>
                      <tbody>
                        {[
                          ["PF (capped ₹1,800)", selected.pf],
                          ["Professional Tax (AP)", selected.pt],
                          ["TDS — New Regime", selected.tds],
                        ].map(([l,v]) => (
                          <tr key={l} style={{borderBottom:"1px solid #E2D8EE"}}>
                            <td style={{padding:"6px 10px"}}>{l}</td>
                            <td style={{padding:"6px 10px", textAlign:"right"}}>{Number(v).toLocaleString("en-IN")}</td>
                          </tr>
                        ))}
                        <tr style={{background:"#F8F2FB"}}>
                          <td style={{padding:"6px 10px", fontWeight:"700"}}>Total Deductions</td>
                          <td style={{padding:"6px 10px", textAlign:"right", fontWeight:"700"}}>{(selected.pf+selected.pt+selected.tds).toLocaleString("en-IN")}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Net pay */}
                  <div style={{background:"#2A1845", color:"#fff", borderRadius:"8px", padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px"}}>
                    <span style={{fontWeight:"700", fontSize:"14px"}}>Net Pay for June 2026</span>
                    <span style={{fontWeight:"800", fontSize:"18px"}}>{inr(selected.net)}</span>
                  </div>

                  <div style={{background:"#F4ECFA", border:"1px solid #E2D8EE", borderRadius:"7px", padding:"8px 12px", fontSize:"10.5px", marginBottom:"16px"}}>
                    This is a system-generated payslip and does not require a physical signature.
                  </div>

                  <div style={{display:"flex", justifyContent:"flex-end", gap:"10px"}}>
                    <button onClick={() => setSelected(null)}
                      style={{background:"#F7F4FE", color:"#6F32B3", border:"1px solid #E2D8EE", borderRadius:"9px", padding:"9px 18px", fontSize:"13px", fontWeight:"600", cursor:"pointer"}}>
                      Close
                    </button>
                    <button onClick={() => window.print()}
                      style={{background:"linear-gradient(135deg,#6F32B3,#B770CE)", color:"#fff", border:"none", borderRadius:"9px", padding:"9px 18px", fontSize:"13px", fontWeight:"600", cursor:"pointer"}}>
                      Print / Save PDF
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
