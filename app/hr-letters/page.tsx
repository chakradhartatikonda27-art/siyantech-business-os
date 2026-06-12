"use client";
import { useState } from "react";

const EMPLOYEES = [
  {id:"1", empCode:"2701", fullName:"Chakradhar Tatikonda", designation:"Managing Director", department:"DevOps & Engineering", dateOfJoining:"24th February 2026", monthlyGross:166667, bankName:"ICICI Bank"},
  {id:"2", empCode:"2702", fullName:"Mohan Shesetty", designation:"Managing Director", department:"Operations", dateOfJoining:"24th February 2026", monthlyGross:166667, bankName:"ICICI Bank"},
  {id:"3", empCode:"2703", fullName:"Sri Sai Kadiyam", designation:"Sr. DevOps Engineer", department:"DevOps & Engineering", dateOfJoining:"02nd May 2022", monthlyGross:95000, bankName:"HDFC Bank"},
  {id:"4", empCode:"2704", fullName:"Priya Vemula", designation:"Python Developer", department:"Software Engineering", dateOfJoining:"10th January 2024", monthlyGross:62000, bankName:"SBI"},
  {id:"5", empCode:"2705", fullName:"Rakesh Pashikanti", designation:"Finance Executive", department:"Accounts", dateOfJoining:"01st August 2023", monthlyGross:45000, bankName:"HDFC Bank"},
  {id:"6", empCode:"2706", fullName:"Anusha Rayudu", designation:"HR & Recruitment", department:"Human Resources", dateOfJoining:"18th September 2023", monthlyGross:38000, bankName:"SBI"},
  {id:"7", empCode:"2707", fullName:"Kiran Bose", designation:"BPO Team Lead", department:"BPO Operations", dateOfJoining:"05th February 2024", monthlyGross:32000, bankName:"Axis Bank"},
];

const LETTER_TYPES = [
  {value:"offer", label:"Offer Letter", icon:"📄"},
  {value:"appointment", label:"Appointment Letter", icon:"📋"},
  {value:"experience", label:"Experience Certificate", icon:"🏆"},
  {value:"relieving", label:"Relieving Letter", icon:"✈"},
  {value:"salary", label:"Salary Certificate", icon:"💰"},
];

const COMPANY = {
  name: "SiyanTech Global Innovations Pvt. Ltd.",
  address: "Flat No. S-4, Third Floor, Rednam Plaza, Dwarakanagar Second Lane, Visakhapatnam - 530016",
  gstin: "37ABHCS2274B2ZF",
  cin: "U72900AP2021PTC119926",
  pan: "ABHCS2274B",
  phone: "+91 9390560625 / +91 6302042599",
  email: "Info@siyantechglobal.com",
  website: "www.siyantechglobal.com",
  iso: "ISO 9001:2015 | ISO/IEC 27001:2022 | MSME Registered",
  signatory: "Chakradhar Tatikonda",
  title: "Managing Director",
};

function inWords(n: number): string {
  const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  const two = (x: number): string => x < 20 ? ones[x] : tens[Math.floor(x/10)] + (x%10?" "+ones[x%10]:"");
  const three = (x: number): string => (x>99?ones[Math.floor(x/100)]+" Hundred"+(x%100?" ":""):"")+(x%100?two(x%100):"");
  let out = ""; const cr=Math.floor(n/1e7); n%=1e7; const lk=Math.floor(n/1e5); n%=1e5; const th=Math.floor(n/1e3); n%=1e3;
  if(cr) out+=three(cr)+" Crore "; if(lk) out+=three(lk)+" Lakh "; if(th) out+=three(th)+" Thousand "; if(n) out+=three(n);
  return out.trim();
}

function getRefNumber(type: string) {
  const map: Record<string,string> = {offer:"OL",appointment:"AL",experience:"EXP",relieving:"RL",salary:"SC"};
  const seq = Math.floor(Math.random()*8)+1;
  return `SGI/HR/2026/${map[type]}/${String(seq).padStart(3,"0")}`;
}

// ── Letterhead shell ──────────────────────────────────────────────────────────
// useHoriz=true  → horizontal logo (invoices, offer letter)
// useHoriz=false → stacked logo   (payslip, experience, relieving, salary)
function lhOpen(useHoriz = false) {
  const logoSrc = useHoriz ? "/logo-horiz.png" : "/logo-stacked.png";
  const logoW   = useHoriz ? "170px" : "110px";
  return `
<div style="position:relative;background:#FAF7FE;font-family:Poppins,sans-serif;min-height:900px;overflow:hidden">

  <!-- sweep top-left -->
  <div style="position:absolute;top:0;left:0;width:55%;height:148px;background:linear-gradient(135deg,#6B30B5 0%,#9044C0 45%,#C07ED8 80%,#C96CC0 100%);border-bottom-right-radius:130px 105px;z-index:1"></div>
  <div style="position:absolute;top:11px;left:0;width:calc(55% - 11px);height:137px;background:#FAF7FE;border-bottom-right-radius:120px 96px;z-index:2"></div>

  <!-- sweep bottom-right -->
  <div style="position:absolute;bottom:0;right:0;width:50%;height:110px;background:linear-gradient(135deg,#6B30B5 0%,#9044C0 45%,#C07ED8 80%,#C96CC0 100%);border-top-left-radius:130px 105px;z-index:1"></div>
  <div style="position:absolute;bottom:34px;right:0;width:calc(50% - 11px);height:76px;background:#FAF7FE;border-top-left-radius:120px 96px;z-index:2"></div>

  <!-- website band -->
  <div style="position:absolute;bottom:0;left:0;right:0;height:34px;background:linear-gradient(135deg,#6B30B5,#9044C0,#C07ED8,#C96CC0);color:#fff;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:500;letter-spacing:.05em;z-index:5">www.siyantechglobal.com</div>

  <!-- logo -->
  <div style="position:absolute;top:16px;right:28px;z-index:6">
    <img src="${logoSrc}" style="width:${logoW};display:block" />
  </div>

  <!-- watermark -->
  <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);opacity:.04;z-index:0;pointer-events:none">
    <img src="/logo-stacked.png" style="width:200px" />
  </div>

  <!-- footer contacts -->
  <div style="position:absolute;bottom:40px;left:44px;right:44px;display:flex;justify-content:space-between;font-size:8.5px;color:#1A1128;z-index:5;line-height:1.55">
    <div><b>☏ ${COMPANY.phone}</b><br>✉ ${COMPANY.email}</div>
    <div style="text-align:right">${COMPANY.address}</div>
  </div>

  <!-- document content -->
  <div style="position:relative;z-index:3;padding:158px 44px 100px">`;
}

function lhClose() {
  return `</div></div>`;
}

function tableRow(cells: string[], even: boolean) {
  return `<tr style="background:${even?"#F6F1FB":"#fff"}">${cells.map((c,i)=>`<td style="padding:5px 9px;border:1px solid #E4DAF0;${i%2===0?"color:#5C5470;font-size:8.5px":"font-weight:600;font-size:9px"}">${c}</td>`).join("")}</tr>`;
}

function secBand(title: string) {
  return `<div style="background:linear-gradient(135deg,#6B30B5,#9044C0,#C07ED8);color:#fff;font-weight:600;font-size:10px;padding:6px 11px;border-radius:5px;margin:12px 0 7px">${title}</div>`;
}

function docTitle(t: string) {
  return `<div style="font-size:18px;font-weight:700;color:#6B30B5;text-align:center;letter-spacing:.06em;border-bottom:2px solid #9B52C0;padding-bottom:6px;margin-bottom:13px">${t}</div>`;
}

function metaRow(ref: string, date: string) {
  return `<div style="display:flex;justify-content:space-between;font-size:9px;font-weight:500;margin-bottom:11px"><span><b>Date:</b> ${date}</span><span><b>Ref No:</b> ${ref}</span></div>`;
}

function sigBlock(ref: string) {
  return `
  <div style="display:flex;justify-content:space-between;margin-top:22px;font-size:9px">
    <div style="color:#5C5470;font-size:8px">${COMPANY.iso}<br>Ref: ${ref} · Verify: hr@siyantechglobal.com</div>
    <div style="text-align:right">For ${COMPANY.name}
      <div style="font-weight:700;border-top:1.5px solid #1A1128;margin-top:28px;padding-top:3px">${COMPANY.signatory}<br><span style="color:#5C5470;font-weight:400">Authorised Signatory</span></div>
    </div>
  </div>`;
}

function thRow(cols: string[]) {
  return `<tr>${cols.map(c=>`<th style="background:#7038BE;color:#fff;text-align:left;padding:6px 9px;font-size:8.5px;font-weight:600">${c}</th>`).join("")}</tr>`;
}

function generateLetter(type: string, emp: typeof EMPLOYEES[0], extra: Record<string,string>) {
  const ref   = getRefNumber(type);
  const today = "12th June 2026";
  const annual = emp.monthlyGross * 12;
  const basic  = Math.round(emp.monthlyGross * 0.5);
  const hra    = Math.round(emp.monthlyGross * 0.25);
  const conv   = 1500;
  const special = emp.monthlyGross - basic - hra - conv;

  // ── OFFER LETTER ────────────────────────────────────────────────────────────
  if (type === "offer") {
    const ctc = +(extra.ctc || annual);
    const ctcM = Math.round(ctc/12);
    const b=Math.round(ctcM*.5), h=Math.round(ctcM*.25), c=1500, s=ctcM-b-h-c;
    return lhOpen(true) + docTitle("OFFER LETTER") + metaRow(ref, today) + `
    <p style="font-size:10px;margin-bottom:7px;line-height:1.6;color:#1A1128">To,<br><b>${extra.candidateName||"[Candidate Name]"}</b><br>${extra.address||"Visakhapatnam, Andhra Pradesh"}</p>
    <p style="font-size:10px;font-weight:600;border-bottom:1px solid #E4DAF0;padding-bottom:6px;margin-bottom:9px">Subject: Letter of Offer — ${extra.role||emp.designation} | CTC: ₹ ${ctc.toLocaleString("en-IN")} Per Annum</p>
    <p style="font-size:10px;margin-bottom:7px;line-height:1.7;text-align:justify">Dear ${(extra.candidateName||"Candidate").split(" ")[0]},<br><br>
    We are delighted to offer you the position of <b>${extra.role||emp.designation}</b> at ${COMPANY.name}, Visakhapatnam. This offer follows your successful performance during the selection process and reflects our confidence in your potential.</p>
    ${secBand("1. TERMS OF EMPLOYMENT")}
    <table style="width:100%;border-collapse:collapse;margin-bottom:8px">
      ${thRow(["Parameter","Details"])}
      ${[["Designation",extra.role||emp.designation],["Department",extra.dept||emp.department],["Date of Joining",extra.joiningDate||"To be confirmed"],["Work Location","Visakhapatnam, Andhra Pradesh (On-site)"],["Probation Period","3 Months from Date of Joining"],["Working Hours","9:00 AM – 6:00 PM | Monday to Friday"],["Notice Period","30 Days (post-probation)"]].map(([k,v],i)=>tableRow([k,v],i%2===1)).join("")}
    </table>
    ${secBand("2. COMPENSATION DETAILS")}
    <table style="width:100%;border-collapse:collapse;margin-bottom:8px">
      ${thRow(["Salary Component","Monthly (₹)","Annual (₹)"])}
      ${[["Basic Salary (50%)",b,b*12],["House Rent Allowance — HRA (25%)",h,h*12],["Conveyance Allowance",c,c*12],["Special Allowance",s,s*12]].map(([l,m,a],i)=>`<tr style="background:${i%2?"#F6F1FB":"#fff"}"><td style="padding:5px 9px;border:1px solid #E4DAF0;font-size:9px">${l}</td><td style="padding:5px 9px;border:1px solid #E4DAF0;text-align:right;font-size:9px">${Number(m).toLocaleString("en-IN")}</td><td style="padding:5px 9px;border:1px solid #E4DAF0;text-align:right;font-size:9px">${Number(a).toLocaleString("en-IN")}</td></tr>`).join("")}
      <tr style="background:#7038BE;color:#fff;font-weight:700"><td style="padding:5px 9px;font-size:9px">Cost to Company (CTC)</td><td style="padding:5px 9px;text-align:right;font-size:9px">${ctcM.toLocaleString("en-IN")}</td><td style="padding:5px 9px;text-align:right;font-size:9px">${ctc.toLocaleString("en-IN")}</td></tr>
    </table>
    <p style="font-size:8.5px;color:#5C5470;margin-top:6px">CTC in words: Rupees ${inWords(ctc)} Only. This offer is valid for 7 days from the date of issue.</p>
    <div style="display:flex;justify-content:space-between;margin-top:20px;font-size:9px">
      <div>For ${COMPANY.name}<div style="font-weight:700;border-top:1.5px solid #1A1128;margin-top:28px;padding-top:3px">${COMPANY.signatory}<br><span style="color:#5C5470;font-weight:400">${COMPANY.title}</span></div></div>
      <div style="text-align:right">Candidate Acceptance<div style="margin-top:28px">Name: ${extra.candidateName||"_______________"}<br>Signature: _______________ &nbsp; Date: _______________</div></div>
    </div>` + lhClose();
  }

  // ── EXPERIENCE CERTIFICATE ──────────────────────────────────────────────────
  if (type === "experience") {
    return lhOpen(false) + docTitle("EXPERIENCE CERTIFICATE") + metaRow(ref, today) + `
    <p style="font-size:10px;font-weight:700;margin-bottom:10px">To Whomsoever It May Concern</p>
    <p style="font-size:10px;line-height:1.75;text-align:justify;margin-bottom:8px">This is to certify that <b>${emp.fullName}</b> (Employee Code: ${emp.empCode}) was employed with ${COMPANY.name}, Visakhapatnam, as <b>${emp.designation}</b> in the ${emp.department} department.</p>
    <p style="font-size:10px;line-height:1.75;text-align:justify;margin-bottom:8px">They joined our organization on <b>${emp.dateOfJoining}</b> and served until <b>${extra.lastDay||today}</b>. During this period, they demonstrated strong commitment, professionalism and a positive attitude towards their responsibilities.</p>
    <p style="font-size:10px;line-height:1.75;text-align:justify;margin-bottom:12px">We wish ${emp.fullName.split(" ")[0]} the very best in all future career endeavours. This certificate is issued at the request of the employee for whatsoever purpose it may serve.</p>
    ${secBand("Employment Details")}
    <table style="width:100%;border-collapse:collapse">
      ${thRow(["Employee Name","Employee Code","Designation","Department"])}
      <tr style="background:#fff"><td style="padding:5px 9px;border:1px solid #E4DAF0;font-size:9px">${emp.fullName}</td><td style="padding:5px 9px;border:1px solid #E4DAF0;font-size:9px">${emp.empCode}</td><td style="padding:5px 9px;border:1px solid #E4DAF0;font-size:9px">${emp.designation}</td><td style="padding:5px 9px;border:1px solid #E4DAF0;font-size:9px">${emp.department}</td></tr>
      ${thRow(["Date of Joining","Last Working Day","",""])}
      <tr style="background:#F6F1FB"><td style="padding:5px 9px;border:1px solid #E4DAF0;font-size:9px">${emp.dateOfJoining}</td><td style="padding:5px 9px;border:1px solid #E4DAF0;font-size:9px">${extra.lastDay||today}</td><td style="border:1px solid #E4DAF0"></td><td style="border:1px solid #E4DAF0"></td></tr>
    </table>
    ${sigBlock(ref)}` + lhClose();
  }

  // ── RELIEVING LETTER ────────────────────────────────────────────────────────
  if (type === "relieving") {
    return lhOpen(false) + docTitle("RELIEVING LETTER") + metaRow(ref, today) + `
    <p style="font-size:10px;margin-bottom:8px">To,<br><b>${emp.fullName}</b><br>${emp.designation}, ${emp.department}</p>
    <p style="font-size:10px;line-height:1.75;text-align:justify;margin-bottom:8px">Dear ${emp.fullName.split(" ")[0]},</p>
    <p style="font-size:10px;line-height:1.75;text-align:justify;margin-bottom:8px">This is with reference to your resignation from the position of <b>${emp.designation}</b> at ${COMPANY.name}.</p>
    <p style="font-size:10px;line-height:1.75;text-align:justify;margin-bottom:8px">We confirm that your resignation has been accepted and you stand relieved from the services of the company with effect from the close of business hours on <b>${extra.lastDay||today}</b>.</p>
    <p style="font-size:10px;line-height:1.75;text-align:justify;margin-bottom:12px">We further confirm that you have completed the handover of all company assets, documents and responsibilities, and that there are no dues pending against you. Your full and final settlement will be processed as per company policy. We thank you for your contribution and wish you the very best.</p>
    ${secBand("Employment Summary")}
    <table style="width:100%;border-collapse:collapse">
      ${thRow(["Field","Details","Field","Details"])}
      ${[["Employee Name",emp.fullName,"Designation",emp.designation],["Date of Joining",emp.dateOfJoining,"Last Working Day",extra.lastDay||today],["Relieving Status","Relieved — No Dues Pending","Department",emp.department]].map(([k1,v1,k2,v2],i)=>tableRow([k1,v1,k2,v2],i%2===1)).join("")}
    </table>
    ${sigBlock(ref)}` + lhClose();
  }

  // ── SALARY CERTIFICATE ──────────────────────────────────────────────────────
  if (type === "salary") {
    return lhOpen(false) + docTitle("SALARY CERTIFICATE") + metaRow(ref, today) + `
    <p style="font-size:10px;font-weight:700;margin-bottom:10px">To Whomsoever It May Concern</p>
    <p style="font-size:10px;line-height:1.75;text-align:justify;margin-bottom:8px">This is to certify that <b>${emp.fullName}</b> (Employee Code: ${emp.empCode}) is a permanent employee of ${COMPANY.name}, working as <b>${emp.designation}</b> since <b>${emp.dateOfJoining}</b>.</p>
    <p style="font-size:10px;line-height:1.75;text-align:justify;margin-bottom:8px">The current monthly gross salary of the employee is <b>₹ ${emp.monthlyGross.toLocaleString("en-IN")}/- (Rupees ${inWords(emp.monthlyGross)} Only)</b>, amounting to an annual gross of <b>₹ ${annual.toLocaleString("en-IN")}/-</b>, subject to statutory deductions as applicable.</p>
    <p style="font-size:10px;line-height:1.75;text-align:justify;margin-bottom:12px">This certificate is issued at the request of the employee for bank / loan / visa or any other lawful purpose, without any liability on the part of the company.</p>
    ${secBand("Employee Details")}
    <table style="width:100%;border-collapse:collapse">
      ${thRow(["Field","Details","Field","Details"])}
      ${[["Name",emp.fullName,"Employee Code",emp.empCode],["Designation",emp.designation,"Department",emp.department],["Date of Joining",emp.dateOfJoining,"Monthly Gross","₹ "+emp.monthlyGross.toLocaleString("en-IN")],["Annual Gross","₹ "+annual.toLocaleString("en-IN"),"Bank",emp.bankName]].map(([k1,v1,k2,v2],i)=>tableRow([k1,v1,k2,v2],i%2===1)).join("")}
    </table>
    ${sigBlock(ref)}` + lhClose();
  }

  // ── APPOINTMENT LETTER ──────────────────────────────────────────────────────
  return lhOpen(true) + docTitle("APPOINTMENT LETTER") + metaRow(ref, today) + `
  <p style="font-size:10px;margin-bottom:8px">To,<br><b>${emp.fullName}</b><br>${emp.designation}</p>
  <p style="font-size:10px;line-height:1.75;text-align:justify;margin-bottom:8px">Dear ${emp.fullName.split(" ")[0]},</p>
  <p style="font-size:10px;line-height:1.75;text-align:justify;margin-bottom:8px">With reference to your acceptance of our offer, we are pleased to appoint you as <b>${emp.designation}</b> at ${COMPANY.name} with effect from <b>${extra.joiningDate||emp.dateOfJoining}</b>.</p>
  <p style="font-size:10px;line-height:1.75;text-align:justify;margin-bottom:12px">Your monthly gross salary will be <b>₹ ${emp.monthlyGross.toLocaleString("en-IN")}/- (Rupees ${inWords(emp.monthlyGross)} Only)</b> as per the salary structure annexed, subject to statutory deductions. You will be on probation for a period of six months from the date of joining. Your employment is governed by the company's confidentiality and information security policies (ISO/IEC 27001:2022).</p>
  ${secBand("COMPENSATION DETAILS")}
  <table style="width:100%;border-collapse:collapse">
    ${thRow(["Component","Monthly (₹)","Annual (₹)"])}
    ${[["Basic Salary (50%)",basic,basic*12],["HRA (25%)",hra,hra*12],["Conveyance Allowance",conv,conv*12],["Special Allowance",special,special*12]].map(([l,m,a],i)=>`<tr style="background:${i%2?"#F6F1FB":"#fff"}"><td style="padding:5px 9px;border:1px solid #E4DAF0;font-size:9px">${l}</td><td style="padding:5px 9px;border:1px solid #E4DAF0;text-align:right;font-size:9px">${Number(m).toLocaleString("en-IN")}</td><td style="padding:5px 9px;border:1px solid #E4DAF0;text-align:right;font-size:9px">${Number(a).toLocaleString("en-IN")}</td></tr>`).join("")}
    <tr style="background:#7038BE;color:#fff;font-weight:700"><td style="padding:5px 9px;font-size:9px">Total Gross</td><td style="padding:5px 9px;text-align:right;font-size:9px">${emp.monthlyGross.toLocaleString("en-IN")}</td><td style="padding:5px 9px;text-align:right;font-size:9px">${annual.toLocaleString("en-IN")}</td></tr>
  </table>
  <div style="display:flex;justify-content:space-between;margin-top:22px;font-size:9px">
    <div>For ${COMPANY.name}<div style="font-weight:700;border-top:1.5px solid #1A1128;margin-top:28px;padding-top:3px">${COMPANY.signatory}<br><span style="color:#5C5470;font-weight:400">${COMPANY.title}</span></div></div>
    <div style="text-align:right">Employee Acceptance<div style="margin-top:28px">Signature: _______________<br>Date: _______________</div></div>
  </div>` + lhClose();
}

export default function HRLettersPage() {
  const [type, setType]       = useState("offer");
  const [empId, setEmpId]     = useState("1");
  const [extra, setExtra]     = useState<Record<string,string>>({});
  const [preview, setPreview] = useState("");

  const emp    = EMPLOYEES.find(e => e.id === empId)!;
  const setEx  = (k: string, v: string) => setExtra(prev => ({...prev, [k]: v}));
  const generate = () => setPreview(generateLetter(type, emp, extra));

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
            {icon:"✉", label:"HR Letters", href:"/hr-letters", active:true},
            {icon:"◈", label:"Leads", href:"/leads"},
            {icon:"₹", label:"Invoices", href:"/invoices"},
            {icon:"▤", label:"Expenses", href:"/expenses"},
            {icon:"▦", label:"Payroll", href:"/payroll"},
          ].map((item) => (
            <a key={item.href} href={item.href}
              style={{display:"flex", alignItems:"center", gap:"10px", padding:"10px 12px", borderRadius:"9px", marginBottom:"4px", color:item.active?"#fff":"rgba(255,255,255,0.7)", background:item.active?"rgba(255,255,255,0.15)":"transparent", textDecoration:"none", fontSize:"13.5px", fontWeight:item.active?"600":"400"}}>
              <span>{item.icon}</span><span>{item.label}</span>
            </a>
          ))}
        </div>

        {/* Main */}
        <div style={{flex:1, padding:"28px"}}>
          <h2 style={{fontSize:"22px", fontWeight:"700", color:"#1E1428", marginBottom:"4px"}}>HR Letters</h2>
          <p style={{fontSize:"13px", color:"#5C5470", marginBottom:"20px"}}>Generate official letters on SiyanTech letterhead with auto reference numbers</p>

          <div style={{display:"grid", gridTemplateColumns:"340px 1fr", gap:"24px", alignItems:"start"}}>

            {/* Form */}
            <div style={{background:"#fff", border:"1px solid #E2D8EE", borderRadius:"14px", padding:"20px"}}>
              <div style={{marginBottom:"16px"}}>
                <label style={{display:"block", fontSize:"11px", fontWeight:"600", color:"#5C5470", textTransform:"uppercase", letterSpacing:"0.04em", marginBottom:"8px"}}>Letter Type</label>
                <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px"}}>
                  {LETTER_TYPES.map(lt => (
                    <button key={lt.value} onClick={() => {setType(lt.value); setPreview("");}}
                      style={{padding:"10px 8px", borderRadius:"9px", border:`2px solid ${type===lt.value?"#6F32B3":"#E2D8EE"}`, background:type===lt.value?"#F7F4FE":"#fff", color:type===lt.value?"#6F32B3":"#5C5470", fontSize:"12px", fontWeight:type===lt.value?"700":"500", cursor:"pointer", textAlign:"center"}}>
                      {lt.icon} {lt.label}
                    </button>
                  ))}
                </div>
              </div>

              {type !== "offer" && (
                <div style={{marginBottom:"14px"}}>
                  <label style={{display:"block", fontSize:"11px", fontWeight:"600", color:"#5C5470", textTransform:"uppercase", marginBottom:"5px"}}>Employee</label>
                  <select value={empId} onChange={e => {setEmpId(e.target.value); setPreview("");}}
                    style={{width:"100%", padding:"9px 11px", border:"1px solid #E2D8EE", borderRadius:"9px", fontSize:"13px", color:"#1E1428", background:"#fff"}}>
                    {EMPLOYEES.map(e => <option key={e.id} value={e.id}>{e.fullName} — {e.designation}</option>)}
                  </select>
                </div>
              )}

              {type === "offer" && (
                <>{[
                  {k:"candidateName", l:"Candidate Name", p:"Suresh Naidu"},
                  {k:"address", l:"Address", p:"Visakhapatnam, AP"},
                  {k:"role", l:"Designation", p:"Senior Python Developer"},
                  {k:"dept", l:"Department", p:"Software Engineering"},
                  {k:"joiningDate", l:"Date of Joining", p:"01st July 2026"},
                  {k:"ctc", l:"Annual CTC (₹)", p:"1450000"},
                ].map(f => (
                  <div key={f.k} style={{marginBottom:"12px"}}>
                    <label style={{display:"block", fontSize:"11px", fontWeight:"600", color:"#5C5470", textTransform:"uppercase", marginBottom:"5px"}}>{f.l}</label>
                    <input placeholder={f.p} value={extra[f.k]||""} onChange={e => setEx(f.k, e.target.value)}
                      style={{width:"100%", padding:"9px 11px", border:"1px solid #E2D8EE", borderRadius:"9px", fontSize:"13px", color:"#1E1428", background:"#fff"}} />
                  </div>
                ))}</>
              )}

              {(type === "experience" || type === "relieving") && (
                <div style={{marginBottom:"12px"}}>
                  <label style={{display:"block", fontSize:"11px", fontWeight:"600", color:"#5C5470", textTransform:"uppercase", marginBottom:"5px"}}>Last Working Day</label>
                  <input placeholder="23rd February 2026" value={extra.lastDay||""} onChange={e => setEx("lastDay", e.target.value)}
                    style={{width:"100%", padding:"9px 11px", border:"1px solid #E2D8EE", borderRadius:"9px", fontSize:"13px", color:"#1E1428", background:"#fff"}} />
                </div>
              )}

              {type === "appointment" && (
                <div style={{marginBottom:"12px"}}>
                  <label style={{display:"block", fontSize:"11px", fontWeight:"600", color:"#5C5470", textTransform:"uppercase", marginBottom:"5px"}}>Date of Joining</label>
                  <input placeholder="01st July 2026" value={extra.joiningDate||""} onChange={e => setEx("joiningDate", e.target.value)}
                    style={{width:"100%", padding:"9px 11px", border:"1px solid #E2D8EE", borderRadius:"9px", fontSize:"13px", color:"#1E1428", background:"#fff"}} />
                </div>
              )}

              <button onClick={generate}
                style={{width:"100%", background:"linear-gradient(135deg,#6F32B3,#B770CE)", color:"#fff", border:"none", borderRadius:"10px", padding:"12px", fontSize:"14px", fontWeight:"600", cursor:"pointer", marginTop:"8px"}}>
                Generate Letter
              </button>
            </div>

            {/* Preview */}
            <div>
              {preview ? (
                <>
                  <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"12px"}}>
                    <div style={{fontWeight:"600", color:"#1E1428"}}>Letter Preview — on official SiyanTech letterhead</div>
                    <button onClick={() => window.print()}
                      style={{background:"linear-gradient(135deg,#6F32B3,#B770CE)", color:"#fff", border:"none", borderRadius:"9px", padding:"8px 16px", fontSize:"13px", fontWeight:"600", cursor:"pointer"}}>
                      🖨 Print / Save PDF
                    </button>
                  </div>
                  <div style={{border:"1px solid #E2D8EE", borderRadius:"14px", overflow:"hidden", boxShadow:"0 8px 32px rgba(44,20,99,.12)"}}>
                    <div dangerouslySetInnerHTML={{__html: preview}} />
                  </div>
                </>
              ) : (
                <div style={{background:"#fff", border:"1px solid #E2D8EE", borderRadius:"14px", padding:"80px", textAlign:"center"}}>
                  <div style={{fontSize:"48px", marginBottom:"16px"}}>✉</div>
                  <div style={{fontSize:"16px", fontWeight:"600", color:"#1E1428", marginBottom:"8px"}}>Select letter type and click Generate</div>
                  <div style={{fontSize:"13px", color:"#5C5470"}}>Letters appear on your official SiyanTech letterhead with purple sweeps, logo, and auto reference numbers</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
