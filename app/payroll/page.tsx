"use client";
import { useState } from "react";

const EMPLOYEES = [
  {id:"1", empCode:"2701", fullName:"Chakradhar Tatikonda", designation:"Managing Director", department:"DevOps & Engineering", pan:"BBCPT0093E", uan:"102067946353", bankAccount:"059601517557", bankIfsc:"ICIC0000596", bankName:"ICICI Bank", monthlyGross:166667, basicPercent:40, hraPercent:20, conveyance:2000, medicalLta:12500, pfCapped:true, workingDays:26, lopDays:0},
  {id:"2", empCode:"2702", fullName:"Mohan Shesetty", designation:"Managing Director", department:"Operations", pan:"—", uan:"—", bankAccount:"—", bankIfsc:"—", bankName:"ICICI Bank", monthlyGross:166667, basicPercent:40, hraPercent:20, conveyance:2000, medicalLta:12500, pfCapped:true, workingDays:26, lopDays:0},
  {id:"3", empCode:"2703", fullName:"Sri Sai Kadiyam", designation:"Sr. DevOps Engineer", department:"DevOps & Engineering", pan:"—", uan:"—", bankAccount:"—", bankIfsc:"—", bankName:"HDFC Bank", monthlyGross:95000, basicPercent:40, hraPercent:20, conveyance:2000, medicalLta:5000, pfCapped:true, workingDays:26, lopDays:0},
  {id:"4", empCode:"2704", fullName:"Priya Vemula", designation:"Python Developer", department:"Software Engineering", pan:"—", uan:"—", bankAccount:"—", bankIfsc:"—", bankName:"SBI", monthlyGross:62000, basicPercent:50, hraPercent:25, conveyance:1500, medicalLta:0, pfCapped:true, workingDays:26, lopDays:1},
  {id:"5", empCode:"2705", fullName:"Rakesh Pashikanti", designation:"Finance Executive", department:"Accounts", pan:"—", uan:"—", bankAccount:"—", bankIfsc:"—", bankName:"HDFC Bank", monthlyGross:45000, basicPercent:50, hraPercent:25, conveyance:1500, medicalLta:0, pfCapped:true, workingDays:26, lopDays:0},
  {id:"6", empCode:"2706", fullName:"Anusha Rayudu", designation:"HR & Recruitment", department:"Human Resources", pan:"—", uan:"—", bankAccount:"—", bankIfsc:"—", bankName:"SBI", monthlyGross:38000, basicPercent:50, hraPercent:25, conveyance:1500, medicalLta:0, pfCapped:true, workingDays:26, lopDays:0},
  {id:"7", empCode:"2707", fullName:"Kiran Bose", designation:"BPO Team Lead", department:"BPO Operations", pan:"—", uan:"—", bankAccount:"—", bankIfsc:"—", bankName:"Axis Bank", monthlyGross:32000, basicPercent:50, hraPercent:25, conveyance:1500, medicalLta:0, pfCapped:true, workingDays:26, lopDays:2},
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
    const t = Math.min(rem, w); if (t <= 0) break;
    tax += t * r; rem -= t;
  }
  return Math.round(tax * 1.04 / 12);
}

function compute(emp: typeof EMPLOYEES[0]) {
  const payable   = emp.workingDays - emp.lopDays;
  const factor    = payable / emp.workingDays;
  const basicFull = emp.monthlyGross * emp.basicPercent / 100;
  const hraFull   = emp.monthlyGross * emp.hraPercent / 100;
  const specFull  = emp.monthlyGross - basicFull - hraFull - emp.conveyance - emp.medicalLta;
  const basic     = Math.round(basicFull * factor);
  const hra       = Math.round(hraFull * factor);
  const conv      = Math.round(emp.conveyance * factor);
  const med       = Math.round(emp.medicalLta * factor);
  const special   = Math.round(specFull * factor);
  const grossEarned = basic + hra + conv + med + special;
  const pf        = Math.min(Math.round(basic * 0.12), 1800);
  const pt        = ptAP(emp.monthlyGross);
  const tdAmt     = tds(emp.monthlyGross);
  const net       = grossEarned - pf - pt - tdAmt;
  return {payable, basic, hra, conv, med, special, grossEarned, pf, pt, tds:tdAmt, net};
}

function inWords(n: number): string {
  const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  const two  = (x: number): string => x < 20 ? ones[x] : tens[Math.floor(x/10)]+(x%10?" "+ones[x%10]:"");
  const three= (x: number): string => (x>99?ones[Math.floor(x/100)]+" Hundred"+(x%100?" ":""):"")+(x%100?two(x%100):"");
  let out=""; let m=n;
  const cr=Math.floor(m/1e7); m%=1e7; const lk=Math.floor(m/1e5); m%=1e5; const th=Math.floor(m/1e3); m%=1e3;
  if(cr) out+=three(cr)+" Crore "; if(lk) out+=three(lk)+" Lakh "; if(th) out+=three(th)+" Thousand "; if(m) out+=three(m);
  return out.trim();
}

const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

type EmpRow = typeof EMPLOYEES[0];
type Computed = ReturnType<typeof compute>;
type EmpResult = EmpRow & Computed;

function Slip({ r }: { r: EmpResult }) {
  return (
    <div style={{position:"relative",background:"#FAF7FE",fontFamily:"Poppins,sans-serif",minHeight:"900px",overflow:"hidden",fontSize:"10px"}}>
      <div style={{position:"absolute",top:0,left:0,width:"55%",height:"148px",background:"linear-gradient(135deg,#6B30B5 0%,#9044C0 45%,#C07ED8 80%,#C96CC0 100%)",borderBottomRightRadius:"130px 105px",zIndex:1}}/>
      <div style={{position:"absolute",top:"11px",left:0,width:"calc(55% - 11px)",height:"137px",background:"#FAF7FE",borderBottomRightRadius:"120px 96px",zIndex:2}}/>
      <div style={{position:"absolute",bottom:0,right:0,width:"50%",height:"110px",background:"linear-gradient(135deg,#6B30B5 0%,#9044C0 45%,#C07ED8 80%,#C96CC0 100%)",borderTopLeftRadius:"130px 105px",zIndex:1}}/>
      <div style={{position:"absolute",bottom:"34px",right:0,width:"calc(50% - 11px)",height:"76px",background:"#FAF7FE",borderTopLeftRadius:"120px 96px",zIndex:2}}/>
      <div style={{position:"absolute",bottom:0,left:0,right:0,height:"34px",background:"linear-gradient(135deg,#6B30B5,#9044C0,#C07ED8,#C96CC0)",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px",fontWeight:500,letterSpacing:".05em",zIndex:5}}>www.siyantechglobal.com</div>
      <div style={{position:"absolute",top:"14px",right:"28px",zIndex:6}}><img src="/logo-stacked.png" style={{width:"110px",display:"block"}} alt="SiyanTech"/></div>
      <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",opacity:.04,zIndex:0,pointerEvents:"none"}}><img src="/logo-stacked.png" style={{width:"200px"}} alt=""/></div>
      <div style={{position:"absolute",bottom:"40px",left:"44px",right:"44px",display:"flex",justifyContent:"space-between",fontSize:"8.5px",color:"#1A1128",zIndex:5,lineHeight:1.55}}>
        <div><b>☏ +91 9390560625 / +91 6302042599</b><br/>✉ Info@siyantechglobal.com</div>
        <div style={{textAlign:"right"}}>Flat No. S-4, Third Floor, Rednam Plaza,<br/>Dwarakanagar Second Lane, Visakhapatnam - 530016</div>
      </div>
      <div style={{position:"relative",zIndex:3,padding:"148px 44px 100px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:"linear-gradient(135deg,#6B30B5,#9044C0,#C07ED8,#C96CC0)",color:"#fff",borderRadius:"6px",padding:"9px 14px",marginBottom:"10px"}}>
          <span style={{fontSize:"15px",fontWeight:700,letterSpacing:".04em"}}>SALARY SLIP</span>
          <span style={{fontSize:"8.5px"}}>June 2026 | Pay Period: 01-Jun-2026 to 30-Jun-2026 | Working Days: {r.payable} / {r.workingDays}</span>
        </div>
        <div style={{fontSize:"8px",letterSpacing:".1em",textTransform:"uppercase",color:"#6B30B5",fontWeight:700,marginBottom:"4px"}}>Employee Information</div>
        <table style={{width:"100%",borderCollapse:"collapse",marginBottom:"10px",fontSize:"9px"}}>
          <tbody>
            {([
              ["Employee Name",r.fullName,"Employee ID",r.empCode],
              ["Designation",r.designation,"Department",r.department],
              ["PAN Number",r.pan,"UAN",r.uan],
              ["Bank Account",r.bankAccount,"IFSC Code",r.bankIfsc],
              ["Bank | Credited",`${r.bankName} | 06-Jul-2026 (NEFT)`,"Working Days",`${r.payable} / ${r.workingDays}`],
            ] as [string,string,string,string][]).map((row,i)=>(
              <tr key={i}>
                <td style={{padding:"4px 8px",background:"#F0EAF8",color:"#5C5470",width:"18%",border:"1px solid #E4DAF0"}}>{row[0]}</td>
                <td style={{padding:"4px 8px",fontWeight:600,width:"32%",border:"1px solid #E4DAF0"}}>{row[1]}</td>
                <td style={{padding:"4px 8px",background:"#F0EAF8",color:"#5C5470",width:"18%",border:"1px solid #E4DAF0"}}>{row[2]}</td>
                <td style={{padding:"4px 8px",fontWeight:600,width:"32%",border:"1px solid #E4DAF0"}}>{row[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{fontSize:"8px",letterSpacing:".1em",textTransform:"uppercase",color:"#6B30B5",fontWeight:700,marginBottom:"4px"}}>Earnings &amp; Deductions</div>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:"9px"}}>
          <thead>
            <tr>
              <th style={{background:"#7038BE",color:"#fff",textAlign:"left",padding:"6px 9px",width:"38%"}}>Earnings</th>
              <th style={{background:"#7038BE",color:"#fff",textAlign:"right",padding:"6px 9px",width:"12%"}}>Amount (₹)</th>
              <th style={{background:"#7038BE",color:"#fff",textAlign:"left",padding:"6px 9px",width:"38%"}}>Deductions</th>
              <th style={{background:"#7038BE",color:"#fff",textAlign:"right",padding:"6px 9px",width:"12%"}}>Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            {([
              [`Basic Salary (${r.basicPercent}%)`,r.basic,"Provident Fund — Employee (₹1,800 cap)",r.pf],
              [`HRA (${r.hraPercent}%)`,r.hra,"Professional Tax (AP)",r.pt],
              ["Special Allowance",r.special,"TDS (New Regime FY 26-27)",r.tds],
              ["Conveyance Allowance",r.conv,"",""],
              ["Medical + LTA",r.med,"",""],
            ] as [string,number|string,string,number|string][]).map(([el,ev,dl,dv],i)=>(
              <tr key={i} style={{background:i%2===0?"#fff":"#F6F1FB"}}>
                <td style={{padding:"5px 9px",border:"1px solid #E4DAF0"}}>{el}</td>
                <td style={{padding:"5px 9px",border:"1px solid #E4DAF0",textAlign:"right"}}>{ev !== "" ? Number(ev).toLocaleString("en-IN") : ""}</td>
                <td style={{padding:"5px 9px",border:"1px solid #E4DAF0"}}>{dl}</td>
                <td style={{padding:"5px 9px",border:"1px solid #E4DAF0",textAlign:"right"}}>{dv !== 0 && dv !== "" ? Number(dv).toLocaleString("en-IN") : ""}</td>
              </tr>
            ))}
            <tr style={{background:"#6B30B5",color:"#fff",fontWeight:700}}>
              <td style={{padding:"6px 9px",border:"1px solid #E4DAF0"}}>Gross Earnings</td>
              <td style={{padding:"6px 9px",border:"1px solid #E4DAF0",textAlign:"right"}}>{r.grossEarned.toLocaleString("en-IN")}</td>
              <td style={{padding:"6px 9px",border:"1px solid #E4DAF0"}}>Total Deductions</td>
              <td style={{padding:"6px 9px",border:"1px solid #E4DAF0",textAlign:"right"}}>{(r.pf+r.pt+r.tds).toLocaleString("en-IN")}</td>
            </tr>
          </tbody>
        </table>
        <div style={{background:"linear-gradient(135deg,#2A1060,#4A1890)",color:"#fff",borderRadius:"0 0 6px 6px",padding:"9px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"7px"}}>
          <div>
            <div style={{fontSize:"11px",fontWeight:600}}>Net Pay for June 2026 <span style={{fontWeight:400,fontSize:"8.5px"}}>(Credited: 06-Jul-2026)</span></div>
            <div style={{fontSize:"8.5px",opacity:.85}}>Gross ₹{r.grossEarned.toLocaleString("en-IN")} − Deductions ₹{(r.pf+r.pt+r.tds).toLocaleString("en-IN")}</div>
          </div>
          <div style={{fontSize:"20px",fontWeight:700}}>₹ {r.net.toLocaleString("en-IN")}</div>
        </div>
        <div style={{background:"#F2ECFC",border:"1px solid #E4DAF0",borderRadius:"5px",padding:"6px 10px",fontSize:"9px",marginBottom:"10px"}}>
          <b>Amount in Words:</b> Rupees {inWords(r.net)} Only
        </div>
        <div style={{fontSize:"8px",letterSpacing:".1em",textTransform:"uppercase",color:"#6B30B5",fontWeight:700,marginBottom:"4px"}}>Employer Statutory Contribution</div>
        <table style={{width:"100%",borderCollapse:"collapse",fontSize:"9px",marginBottom:"12px"}}>
          <thead>
            <tr>
              <th style={{background:"#7038BE",color:"#fff",textAlign:"left",padding:"6px 9px",width:"50%"}}>Component</th>
              <th style={{background:"#7038BE",color:"#fff",textAlign:"right",padding:"6px 9px"}}>Employee (₹)</th>
              <th style={{background:"#7038BE",color:"#fff",textAlign:"right",padding:"6px 9px"}}>Employer (₹)</th>
              <th style={{background:"#7038BE",color:"#fff",textAlign:"right",padding:"6px 9px"}}>Total (₹)</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{background:"#fff"}}><td style={{padding:"5px 9px",border:"1px solid #E4DAF0"}}>Provident Fund (capped ₹1,800)</td><td style={{padding:"5px 9px",border:"1px solid #E4DAF0",textAlign:"right"}}>{r.pf}</td><td style={{padding:"5px 9px",border:"1px solid #E4DAF0",textAlign:"right"}}>{r.pf}</td><td style={{padding:"5px 9px",border:"1px solid #E4DAF0",textAlign:"right"}}>{r.pf*2}</td></tr>
            <tr style={{background:"#F6F1FB"}}><td style={{padding:"5px 9px",border:"1px solid #E4DAF0"}}>Professional Tax</td><td style={{padding:"5px 9px",border:"1px solid #E4DAF0",textAlign:"right"}}>{r.pt}</td><td style={{padding:"5px 9px",border:"1px solid #E4DAF0",textAlign:"right"}}>—</td><td style={{padding:"5px 9px",border:"1px solid #E4DAF0",textAlign:"right"}}>{r.pt}</td></tr>
            <tr style={{background:"#fff"}}><td style={{padding:"5px 9px",border:"1px solid #E4DAF0"}}>TDS (Income Tax)</td><td style={{padding:"5px 9px",border:"1px solid #E4DAF0",textAlign:"right"}}>{r.tds}</td><td style={{padding:"5px 9px",border:"1px solid #E4DAF0",textAlign:"right"}}>—</td><td style={{padding:"5px 9px",border:"1px solid #E4DAF0",textAlign:"right"}}>{r.tds}</td></tr>
            <tr style={{fontWeight:700,background:"#F0EAF8"}}><td style={{padding:"5px 9px",border:"1px solid #E4DAF0"}}>Total</td><td style={{padding:"5px 9px",border:"1px solid #E4DAF0",textAlign:"right"}}>{r.pf+r.pt+r.tds}</td><td style={{padding:"5px 9px",border:"1px solid #E4DAF0",textAlign:"right"}}>{r.pf}</td><td style={{padding:"5px 9px",border:"1px solid #E4DAF0",textAlign:"right"}}>{r.pf*2+r.pt+r.tds}</td></tr>
          </tbody>
        </table>
        <div style={{background:"#F2ECFC",border:"1px solid #E4DAF0",borderRadius:"5px",padding:"7px 11px",fontSize:"9px",textAlign:"center"}}>
          This is a system-generated payslip and does not require a physical signature. SiyanTech Global Innovations Pvt. Ltd.
        </div>
      </div>
    </div>
  );
}

export default function PayrollPage() {
  const [ran, setRan]         = useState(false);
  const [running, setRunning] = useState(false);
  const [selected, setSelected] = useState<EmpResult | null>(null);

  const run = () => { setRunning(true); setTimeout(()=>{setRunning(false);setRan(true);},2000); };
  const results: EmpResult[] = EMPLOYEES.map(e => ({...e, ...compute(e)}));
  const totalNet   = results.reduce((s,r)=>s+r.net,0);
  const totalGross = results.reduce((s,r)=>s+r.grossEarned,0);

  return (
    <div style={{minHeight:"100vh",background:"#F5F3FA",fontFamily:"sans-serif"}}>
      <div style={{background:"#fff",borderBottom:"1px solid #E2D8EE",padding:"14px 28px",display:"flex",alignItems:"center",gap:"16px"}}>
        <div style={{width:"36px",height:"36px",borderRadius:"10px",background:"linear-gradient(135deg,#6F32B3,#B770CE)",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:"800",fontSize:"18px"}}>S</div>
        <div>
          <div style={{fontWeight:"700",fontSize:"16px",color:"#1E1428"}}>SiyanTech Business OS</div>
          <div style={{fontSize:"11px",color:"#5C5470"}}>SiyanTech Global Innovations Pvt. Ltd.</div>
        </div>
        <div style={{marginLeft:"auto"}}><a href="/dashboard" style={{fontSize:"13px",color:"#6F32B3",textDecoration:"none"}}>← Dashboard</a></div>
      </div>
      <div style={{display:"flex"}}>
        <div style={{width:"220px",background:"#2C1463",minHeight:"calc(100vh - 65px)",padding:"20px 12px"}}>
          {[{icon:"◧",label:"Dashboard",href:"/dashboard"},{icon:"⏱",label:"Attendance",href:"/attendance"},{icon:"✈",label:"Leaves",href:"/leaves"},{icon:"☰",label:"Employees",href:"/employees"},{icon:"✉",label:"HR Letters",href:"/hr-letters"},{icon:"◈",label:"Leads",href:"/leads"},{icon:"₹",label:"Invoices",href:"/invoices"},{icon:"▤",label:"Expenses",href:"/expenses"},{icon:"▦",label:"Payroll",href:"/payroll",active:true}].map(item=>(
            <a key={item.href} href={item.href} style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px 12px",borderRadius:"9px",marginBottom:"4px",color:item.active?"#fff":"rgba(255,255,255,0.7)",background:item.active?"rgba(255,255,255,0.15)":"transparent",textDecoration:"none",fontSize:"13.5px",fontWeight:item.active?"600":"400"}}>
              <span>{item.icon}</span><span>{item.label}</span>
            </a>
          ))}
        </div>
        <div style={{flex:1,padding:"28px"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:"20px"}}>
            <div>
              <h2 style={{fontSize:"22px",fontWeight:"700",color:"#1E1428"}}>Payroll — June 2026</h2>
              <p style={{fontSize:"13px",color:"#5C5470",marginTop:"2px"}}>7 employees · PF capped ₹1,800 · New Regime TDS · AP Professional Tax</p>
            </div>
            {!ran ? (
              <button onClick={run} disabled={running} style={{background:"linear-gradient(135deg,#6F32B3,#B770CE)",color:"#fff",border:"none",borderRadius:"10px",padding:"12px 24px",fontSize:"14px",fontWeight:"600",cursor:"pointer",opacity:running?0.7:1}}>
                {running?"Computing...":"▦ Run Payroll"}
              </button>
            ) : (
              <div style={{background:"#E3F6EE",color:"#0E9F6E",padding:"10px 18px",borderRadius:"10px",fontWeight:"600",fontSize:"13.5px"}}>✓ Payroll finalized</div>
            )}
          </div>
          {ran && (
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:"16px",marginBottom:"24px"}}>
              {[
                {label:"Total Gross",value:inr(totalGross),color:"#6F32B3"},
                {label:"Total Net Pay",value:inr(totalNet),color:"#0E9F6E"},
                {label:"Total PF (Employer)",value:inr(results.reduce((s,r)=>s+r.pf,0)),color:"#C77B0A"},
                {label:"Total TDS",value:inr(results.reduce((s,r)=>s+r.tds,0)),color:"#D6455D"},
              ].map(k=>(
                <div key={k.label} style={{background:"#fff",border:"1px solid #E2D8EE",borderRadius:"14px",padding:"18px"}}>
                  <div style={{fontSize:"11px",fontWeight:"600",color:"#5C5470",textTransform:"uppercase",letterSpacing:"0.04em"}}>{k.label}</div>
                  <div style={{fontSize:"22px",fontWeight:"800",color:k.color,marginTop:"6px"}}>{k.value}</div>
                </div>
              ))}
            </div>
          )}
          {ran && (
            <div style={{background:"#fff",border:"1px solid #E2D8EE",borderRadius:"14px",overflow:"hidden"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:"13px"}}>
                <thead>
                  <tr style={{background:"#7B3CC4"}}>
                    {["Employee","Payable Days","Gross Earned","PF","Prof. Tax","TDS","Net Pay",""].map(h=>(
                      <th key={h} style={{padding:"11px 14px",textAlign:"left",color:"#fff",fontSize:"11px",fontWeight:"600",letterSpacing:"0.07em",textTransform:"uppercase"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((r,i)=>(
                    <tr key={r.id} style={{borderBottom:"1px solid #E2D8EE",background:i%2===0?"#fff":"#F8F2FB"}}>
                      <td style={{padding:"12px 14px"}}>
                        <div style={{fontWeight:"600",color:"#1E1428"}}>{r.fullName}</div>
                        <div style={{fontSize:"11px",color:"#5C5470"}}>{r.designation}</div>
                      </td>
                      <td style={{padding:"12px 14px"}}>
                        {r.payable}
                        {r.lopDays>0&&<span style={{marginLeft:"6px",background:"#FBE7EB",color:"#D6455D",padding:"2px 7px",borderRadius:"99px",fontSize:"10.5px",fontWeight:"600"}}>{r.lopDays} LOP</span>}
                      </td>
                      <td style={{padding:"12px 14px",fontWeight:"600"}}>{inr(r.grossEarned)}</td>
                      <td style={{padding:"12px 14px",color:"#5C5470"}}>{inr(r.pf)}</td>
                      <td style={{padding:"12px 14px",color:"#5C5470"}}>{inr(r.pt)}</td>
                      <td style={{padding:"12px 14px",color:"#5C5470"}}>{inr(r.tds)}</td>
                      <td style={{padding:"12px 14px",fontWeight:"700",color:"#0E9F6E",fontSize:"14px"}}>{inr(r.net)}</td>
                      <td style={{padding:"12px 14px"}}>
                        <button onClick={()=>setSelected(r)} style={{background:"#F7F4FE",color:"#6F32B3",border:"none",borderRadius:"7px",padding:"6px 12px",fontSize:"12px",fontWeight:"600",cursor:"pointer"}}>Payslip</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {!ran&&!running&&(
            <div style={{background:"#fff",border:"1px solid #E2D8EE",borderRadius:"14px",padding:"60px",textAlign:"center"}}>
              <div style={{fontSize:"48px",marginBottom:"16px"}}>▦</div>
              <div style={{fontSize:"16px",fontWeight:"600",color:"#1E1428",marginBottom:"8px"}}>Ready to run June 2026 payroll</div>
              <div style={{fontSize:"13px",color:"#5C5470"}}>LOP days shown in red · PF capped ₹1,800 · New Regime TDS · AP Professional Tax</div>
            </div>
          )}
          {running&&(
            <div style={{background:"#fff",border:"1px solid #E2D8EE",borderRadius:"14px",padding:"60px",textAlign:"center"}}>
              <div style={{fontSize:"13px",color:"#5C5470",lineHeight:"2"}}>
                ⏳ Pulling June attendance records...<br/>
                ⏳ Computing LOP deductions...<br/>
                ⏳ Calculating PF (capped ₹1,800)...<br/>
                ⏳ Applying AP Professional Tax...<br/>
                ⏳ Computing New Regime TDS FY 2026-27...<br/>
                ⏳ Generating 7 payslips...
              </div>
            </div>
          )}
          {selected&&(
            <div style={{position:"fixed",inset:0,background:"rgba(33,26,53,.55)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:50,padding:"20px"}}>
              <div style={{width:"680px",maxWidth:"95vw",maxHeight:"92vh",overflowY:"auto",borderRadius:"16px",boxShadow:"0 20px 60px rgba(44,20,99,.35)"}}>
                <Slip r={selected}/>
                <div style={{background:"#fff",padding:"14px 20px",display:"flex",justifyContent:"flex-end",gap:"10px",borderTop:"1px solid #E2D8EE"}}>
                  <button onClick={()=>setSelected(null)} style={{background:"#F7F4FE",color:"#6F32B3",border:"1px solid #E2D8EE",borderRadius:"9px",padding:"9px 18px",fontSize:"13px",fontWeight:"600",cursor:"pointer"}}>Close</button>
                  <button onClick={()=>window.print()} style={{background:"linear-gradient(135deg,#6F32B3,#B770CE)",color:"#fff",border:"none",borderRadius:"9px",padding:"9px 18px",fontSize:"13px",fontWeight:"600",cursor:"pointer"}}>🖨 Print / Save PDF</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
