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

const SIGNATORIES = [
  {name:"Chakradhar Tatikonda", title:"Managing Director"},
  {name:"Mohan Shesetty", title:"Managing Director"},
  {name:"D. Mallika Arjuna Rao", title:"Chief Technology Officer"},
  {name:"A. Anju Krishnan", title:"Sr. HR Manager"},
  {name:"K. Mallikarjun Rao", title:"Chief Financial Officer"},
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
  phone: "+91 9390560625 / +91 6302042599",
  email: "Info@siyantechglobal.com",
  iso: "ISO 9001:2015 | ISO/IEC 27001:2022 | MSME Registered",
};

type CompRow = {label:string; monthly:number; annual:number};

function inWords(n: number): string {
  const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  const two = (x: number): string => x < 20 ? ones[x] : tens[Math.floor(x/10)]+(x%10?" "+ones[x%10]:"");
  const three = (x: number): string => (x>99?ones[Math.floor(x/100)]+" Hundred"+(x%100?" ":""):"")+(x%100?two(x%100):"");
  let out=""; let m=n;
  const cr=Math.floor(m/1e7); m%=1e7; const lk=Math.floor(m/1e5); m%=1e5; const th=Math.floor(m/1e3); m%=1e3;
  if(cr) out+=three(cr)+" Crore "; if(lk) out+=three(lk)+" Lakh "; if(th) out+=three(th)+" Thousand "; if(m) out+=three(m);
  return out.trim();
}

function getRef(type: string) {
  const map: Record<string,string> = {offer:"OL",appointment:"AL",experience:"EXP",relieving:"RL",salary:"SC"};
  return `SGI/HR/2026/${map[type]}/${String(Math.floor(Math.random()*90)+10).padStart(3,"0")}`;
}

function defaultCompRows(g: number): CompRow[] {
  const basic = Math.round(g*0.5), hra=Math.round(g*0.25), conv=1500;
  const pf = Math.min(Math.round(basic*0.12),1800), ins=500;
  const special = Math.max(g-basic-hra-conv-pf-ins,0);
  return [
    {label:"Basic Salary (50%)", monthly:basic, annual:basic*12},
    {label:"House Rent Allowance — HRA (25%)", monthly:hra, annual:hra*12},
    {label:"Conveyance Allowance", monthly:conv, annual:conv*12},
    {label:"Provident Fund — Employee (12% of Basic, capped)", monthly:pf, annual:pf*12},
    {label:"Medical Insurance", monthly:ins, annual:ins*12},
    {label:"Special Allowance", monthly:special, annual:special*12},
  ];
}

function lhOpen() {
  return `<div style="position:relative;font-family:Poppins,sans-serif;width:794px;background:#fff;margin:0 auto"><img src="/letterhead.png" style="position:absolute;top:0;left:0;width:100%;height:auto;z-index:0;pointer-events:none" /><div style="position:relative;z-index:3;padding:280px 65px 160px;color:#1A1128;font-size:11px;line-height:1.7">`;
}
function lhClose() { return `</div></div>`; }

function secBand(t: string) {
  return `<div style="background:linear-gradient(135deg,#6B30B5,#9044C0);color:#fff;font-weight:600;font-size:10.5px;padding:7px 12px;border-radius:5px;margin:14px 0 8px">${t}</div>`;
}
function thRow(cols: string[]) {
  return `<tr>${cols.map(c=>`<th style="background:#7038BE;color:#fff;text-align:left;padding:7px 10px;font-size:9.5px;font-weight:600;border:1px solid #E4DAF0">${c}</th>`).join("")}</tr>`;
}

function sigBlock(signatory: string, sigTitle: string, candidateName?: string) {
  return `<div style="display:flex;justify-content:space-between;margin-top:30px;font-size:10.5px">
    <div>For ${COMPANY.name}<br><br><br><b>${signatory}</b><br><span style="color:#5C5470">${sigTitle}</span><br><span style="color:#5C5470;font-size:9px">SiyanTech Global Innovations Pvt. Ltd.</span></div>
    ${candidateName!==undefined?`<div>Candidate Acceptance<br><br><br>Name: <b>${candidateName||"___________________________"}</b><br><br>Signature: ___________________________<br><br>Date: ___________________________</div>`:""}
  </div>`;
}

function generateLetter(type: string, emp: typeof EMPLOYEES[0], extra: Record<string,string>, compRows: CompRow[], signatory: string, sigTitle: string) {
  const ref = getRef(type);
  const today = "12th June 2026";
  const annual = emp.monthlyGross * 12;
  const ctc = +(extra.ctc || annual);
  const totalM = compRows.reduce((s,r)=>s+r.monthly,0);
  const totalA = compRows.reduce((s,r)=>s+r.annual,0);
  const desc = extra.description;

  const compTable = (title: string) => `
    ${secBand(title)}
    <table style="width:100%;border-collapse:collapse;margin-bottom:10px">
      ${thRow(["Salary Component","Monthly (₹)","Annual (₹)"])}
      ${compRows.map((r,i)=>`<tr style="background:${i%2?"#F6F1FB":"#fff"}"><td style="padding:6px 10px;border:1px solid #E4DAF0;font-size:10px;color:#6B30B5;font-weight:600">${r.label}</td><td style="padding:6px 10px;border:1px solid #E4DAF0;font-size:10px;text-align:right">${r.monthly.toLocaleString("en-IN")}</td><td style="padding:6px 10px;border:1px solid #E4DAF0;font-size:10px;text-align:right">${r.annual.toLocaleString("en-IN")}</td></tr>`).join("")}
      <tr style="background:#7038BE;color:#fff;font-weight:700"><td style="padding:6px 10px;border:1px solid #E4DAF0;font-size:10px">Cost to Company (CTC)</td><td style="padding:6px 10px;border:1px solid #E4DAF0;font-size:10px;text-align:right">${totalM.toLocaleString("en-IN")}</td><td style="padding:6px 10px;border:1px solid #E4DAF0;font-size:10px;text-align:right">${totalA.toLocaleString("en-IN")}</td></tr>
    </table>`;

  if (type==="offer") {
    return lhOpen()+`
    <div style="font-size:20px;font-weight:700;color:#6B30B5;text-align:center;border-bottom:2px solid #6B30B5;padding-bottom:6px;margin-bottom:14px">OFFER LETTER</div>
    <div style="display:flex;justify-content:space-between;font-size:10.5px;margin-bottom:12px"><span><b>Date:</b> ${today}</span><span><b>Ref No:</b> ${ref}</span></div>
    <p style="margin-bottom:10px">To,<br><b>${extra.candidateName||"[Candidate Name]"}</b><br>${extra.address||"Visakhapatnam, Andhra Pradesh"}</p>
    <p style="margin-bottom:10px"><b>Subject: Letter of Offer — ${extra.role||emp.designation} | CTC: ₹ ${ctc.toLocaleString("en-IN")} Per Annum</b></p>
    <div style="border-bottom:1px solid #ccc;margin-bottom:10px"></div>
    <p style="margin-bottom:6px">Dear ${(extra.candidateName||"Candidate").split(" ")[0]},</p>
    <p style="margin-bottom:12px;text-align:justify">${desc||`We are delighted to offer you the position of <b>${extra.role||emp.designation}</b> at ${COMPANY.name}, Visakhapatnam. This offer follows your successful performance during the selection process and reflects our confidence in your potential to contribute to our growing team.`}</p>
    ${secBand("1. TERMS OF EMPLOYMENT")}
    <table style="width:100%;border-collapse:collapse;margin-bottom:10px">
      ${thRow(["Parameter","Details"])}
      ${[["Designation",extra.role||emp.designation],["Department",extra.dept||emp.department],["Employment Type",extra.empType||"Full Time"],["Date of Joining",extra.joiningDate||"To be confirmed at time of joining"],["Work Location","Visakhapatnam, Andhra Pradesh (On-site)"],["Reporting To",extra.reportingTo||"HR Manager / Managing Director"],["Probation Period","3 Months from Date of Joining"],["Working Hours","9:00 AM – 6:00 PM | Monday to Friday"],["Notice Period","30 Days (post-probation)"]].map(([k,v],i)=>`<tr style="background:${i%2?"#F6F1FB":"#fff"}"><td style="padding:6px 10px;border:1px solid #E4DAF0;font-size:10px;color:#6B30B5;font-weight:600">${k}</td><td style="padding:6px 10px;border:1px solid #E4DAF0;font-size:10px">${v}</td></tr>`).join("")}
    </table>
    ${compTable("2. COMPENSATION DETAILS")}
    <p style="font-size:9px;color:#5C5470;margin-bottom:10px">CTC in words: Rupees ${inWords(ctc)} Only.</p>
    ${secBand("3. TERMS & CONDITIONS")}
    <ol style="font-size:10px;line-height:1.8;margin-left:18px;margin-bottom:12px">
      <li>This offer is subject to verification of all original educational certificates, identity proof and other relevant documents at the time of joining.</li>
      <li>During the probation period of 3 months, either party may terminate employment with 7 days' written notice.</li>
      <li>You are required to maintain strict confidentiality of all company data, client information and business processes during and after employment.</li>
      <li>This offer letter is valid for 7 days from the date of issue. Kindly sign and return a copy as confirmation of acceptance.</li>
      <li>Any false declaration of information or credentials shall lead to immediate termination of employment.</li>
      <li>The employee shall comply with all company policies including the Information Security Policy (ISO/IEC 27001:2022) and Code of Conduct.</li>
    </ol>
    <p style="font-size:10px;margin-bottom:6px">We welcome you to the SiyanTech family and look forward to a long and productive association.</p>
    ${sigBlock(signatory, sigTitle, extra.candidateName)}
    `+lhClose();
  }

  if (type==="experience") {
    return lhOpen()+`
    <div style="font-size:20px;font-weight:700;color:#6B30B5;text-align:center;border-bottom:2px solid #6B30B5;padding-bottom:6px;margin-bottom:14px">EXPERIENCE CERTIFICATE</div>
    <div style="display:flex;justify-content:space-between;font-size:10.5px;margin-bottom:16px"><span><b>Date:</b> ${today}</span><span><b>Ref No:</b> ${ref}</span></div>
    <p style="font-weight:700;margin-bottom:12px">To Whomsoever It May Concern</p>
    <p style="margin-bottom:10px;text-align:justify">${desc||`This is to certify that <b>${emp.fullName}</b> (Employee Code: ${emp.empCode}) was employed with ${COMPANY.name}, Visakhapatnam, as <b>${emp.designation}</b> in the ${emp.department} department.`}</p>
    <p style="margin-bottom:10px;text-align:justify">They joined our organization on <b>${emp.dateOfJoining}</b> and served until <b>${extra.lastDay||today}</b>. During this period, they demonstrated strong commitment, professionalism and a positive attitude.</p>
    <p style="margin-bottom:14px;text-align:justify">We wish ${emp.fullName.split(" ")[0]} the very best in all future career endeavours.</p>
    ${secBand("Employment Details")}
    <table style="width:100%;border-collapse:collapse;margin-bottom:14px">
      ${thRow(["Field","Details","Field","Details"])}
      ${[["Employee Name",emp.fullName,"Employee Code",emp.empCode],["Designation",emp.designation,"Department",emp.department],["Date of Joining",emp.dateOfJoining,"Last Working Day",extra.lastDay||today]].map(([k1,v1,k2,v2],i)=>`<tr style="background:${i%2?"#F6F1FB":"#fff"}"><td style="padding:6px 10px;border:1px solid #E4DAF0;font-size:10px;color:#6B30B5;font-weight:600">${k1}</td><td style="padding:6px 10px;border:1px solid #E4DAF0;font-size:10px">${v1}</td><td style="padding:6px 10px;border:1px solid #E4DAF0;font-size:10px;color:#6B30B5;font-weight:600">${k2}</td><td style="padding:6px 10px;border:1px solid #E4DAF0;font-size:10px">${v2}</td></tr>`).join("")}
    </table>
    ${sigBlock(signatory, sigTitle)}
    `+lhClose();
  }

  if (type==="relieving") {
    return lhOpen()+`
    <div style="font-size:20px;font-weight:700;color:#6B30B5;text-align:center;border-bottom:2px solid #6B30B5;padding-bottom:6px;margin-bottom:14px">RELIEVING LETTER</div>
    <div style="display:flex;justify-content:space-between;font-size:10.5px;margin-bottom:12px"><span><b>Date:</b> ${today}</span><span><b>Ref No:</b> ${ref}</span></div>
    <p style="margin-bottom:10px">To,<br><b>${emp.fullName}</b><br>${emp.designation}</p>
    <p style="margin-bottom:8px">Dear ${emp.fullName.split(" ")[0]},</p>
    <p style="margin-bottom:8px;text-align:justify">${desc||`This is with reference to your resignation from the position of <b>${emp.designation}</b> at ${COMPANY.name}.`}</p>
    <p style="margin-bottom:8px;text-align:justify">We confirm that your resignation has been accepted and you stand relieved from the services of the company with effect from the close of business hours on <b>${extra.lastDay||today}</b>.</p>
    <p style="margin-bottom:14px;text-align:justify">We further confirm that you have completed the handover of all company assets and responsibilities, and there are no dues pending against you.</p>
    ${secBand("Employment Summary")}
    <table style="width:100%;border-collapse:collapse;margin-bottom:14px">
      ${thRow(["Field","Details","Field","Details"])}
      ${[["Employee Name",emp.fullName,"Designation",emp.designation],["Date of Joining",emp.dateOfJoining,"Last Working Day",extra.lastDay||today],["Department",emp.department,"Status","Relieved — No Dues Pending"]].map(([k1,v1,k2,v2],i)=>`<tr style="background:${i%2?"#F6F1FB":"#fff"}"><td style="padding:6px 10px;border:1px solid #E4DAF0;font-size:10px;color:#6B30B5;font-weight:600">${k1}</td><td style="padding:6px 10px;border:1px solid #E4DAF0;font-size:10px">${v1}</td><td style="padding:6px 10px;border:1px solid #E4DAF0;font-size:10px;color:#6B30B5;font-weight:600">${k2}</td><td style="padding:6px 10px;border:1px solid #E4DAF0;font-size:10px">${v2}</td></tr>`).join("")}
    </table>
    ${sigBlock(signatory, sigTitle)}
    `+lhClose();
  }

  if (type==="salary") {
    return lhOpen()+`
    <div style="font-size:20px;font-weight:700;color:#6B30B5;text-align:center;border-bottom:2px solid #6B30B5;padding-bottom:6px;margin-bottom:14px">SALARY CERTIFICATE</div>
    <div style="display:flex;justify-content:space-between;font-size:10.5px;margin-bottom:16px"><span><b>Date:</b> ${today}</span><span><b>Ref No:</b> ${ref}</span></div>
    <p style="font-weight:700;margin-bottom:10px">To Whomsoever It May Concern</p>
    <p style="margin-bottom:10px;text-align:justify">${desc||`This is to certify that <b>${emp.fullName}</b> (Employee Code: ${emp.empCode}) is a permanent employee of ${COMPANY.name}, working as <b>${emp.designation}</b> since <b>${emp.dateOfJoining}</b>.`}</p>
    <p style="margin-bottom:10px;text-align:justify">The current monthly gross salary is <b>₹ ${emp.monthlyGross.toLocaleString("en-IN")}/- (Rupees ${inWords(emp.monthlyGross)} Only)</b>, amounting to an annual gross of <b>₹ ${annual.toLocaleString("en-IN")}/-</b>, subject to statutory deductions.</p>
    <p style="margin-bottom:14px;text-align:justify">This certificate is issued at the request of the employee for bank / loan / visa or any other lawful purpose, without any liability on the part of the company.</p>
    ${secBand("Employee Details")}
    <table style="width:100%;border-collapse:collapse;margin-bottom:14px">
      ${thRow(["Field","Details","Field","Details"])}
      ${[["Name",emp.fullName,"Employee Code",emp.empCode],["Designation",emp.designation,"Department",emp.department],["Date of Joining",emp.dateOfJoining,"Monthly Gross","₹ "+emp.monthlyGross.toLocaleString("en-IN")]].map(([k1,v1,k2,v2],i)=>`<tr style="background:${i%2?"#F6F1FB":"#fff"}"><td style="padding:6px 10px;border:1px solid #E4DAF0;font-size:10px;color:#6B30B5;font-weight:600">${k1}</td><td style="padding:6px 10px;border:1px solid #E4DAF0;font-size:10px">${v1}</td><td style="padding:6px 10px;border:1px solid #E4DAF0;font-size:10px;color:#6B30B5;font-weight:600">${k2}</td><td style="padding:6px 10px;border:1px solid #E4DAF0;font-size:10px">${v2}</td></tr>`).join("")}
    </table>
    ${sigBlock(signatory, sigTitle)}
    `+lhClose();
  }

  // appointment
  return lhOpen()+`
  <div style="font-size:20px;font-weight:700;color:#6B30B5;text-align:center;border-bottom:2px solid #6B30B5;padding-bottom:6px;margin-bottom:14px">APPOINTMENT LETTER</div>
  <div style="display:flex;justify-content:space-between;font-size:10.5px;margin-bottom:12px"><span><b>Date:</b> ${today}</span><span><b>Ref No:</b> ${ref}</span></div>
  <p style="margin-bottom:10px">To,<br><b>${emp.fullName}</b><br>${emp.designation}</p>
  <p style="margin-bottom:8px">Dear ${emp.fullName.split(" ")[0]},</p>
  <p style="margin-bottom:10px;text-align:justify">${desc||`With reference to your acceptance of our offer, we are pleased to appoint you as <b>${emp.designation}</b> at ${COMPANY.name} with effect from <b>${extra.joiningDate||emp.dateOfJoining}</b>.`}</p>
  <p style="margin-bottom:12px;text-align:justify">Your monthly gross salary will be <b>₹ ${emp.monthlyGross.toLocaleString("en-IN")}/- (Rupees ${inWords(emp.monthlyGross)} Only)</b> as per the salary structure annexed, subject to statutory deductions.</p>
  ${compTable("COMPENSATION DETAILS")}
  ${sigBlock(signatory, sigTitle)}
  `+lhClose();
}

export default function HRLettersPage() {
  const [type, setType]       = useState("offer");
  const [empId, setEmpId]     = useState("1");
  const [extra, setExtra]     = useState<Record<string,string>>({});
  const [preview, setPreview] = useState("");
  const [sigIdx, setSigIdx]   = useState(0);
  const [compRows, setCompRows] = useState<CompRow[]>(() => defaultCompRows(EMPLOYEES[0].monthlyGross));

  const emp   = EMPLOYEES.find(e => e.id === empId)!;
  const setEx = (k: string, v: string) => setExtra(prev => ({...prev, [k]: v}));

  const updateEmp = (id: string) => {
    setEmpId(id);
    setCompRows(defaultCompRows(EMPLOYEES.find(e=>e.id===id)!.monthlyGross));
    setPreview("");
  };

  const addRow    = () => setCompRows([...compRows, {label:"New Component", monthly:0, annual:0}]);
  const removeRow = (i: number) => setCompRows(compRows.filter((_,idx)=>idx!==i));
  const updateRow = (i: number, field: keyof CompRow, val: string) => {
    const u = [...compRows];
    if (field==="label") u[i].label=val;
    else { const n=+val||0; u[i][field]=n; if(field==="monthly") u[i].annual=n*12; if(field==="annual") u[i].monthly=Math.round(n/12); }
    setCompRows(u);
  };

  const downloadPDF = async () => {
    const sig = SIGNATORIES[sigIdx];
    const body = {
      type, empName:emp.fullName, empCode:emp.empCode, designation:emp.designation,
      department:emp.department, dateOfJoining:emp.dateOfJoining, monthlyGross:emp.monthlyGross,
      description:extra.description||"", extra, compRows,
      signatory:sig.name, sigTitle:sig.title,
      refNumber:getRef(type), today:"12th June 2026",
    };
    const res  = await fetch("/api/generate-letter", {method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(body)});
    const blob = await res.blob();
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a"); a.href=url; a.download=`siyantech-${type}-letter.pdf`; a.click();
    URL.revokeObjectURL(url);
  };

  const generate = () => {
    const sig = SIGNATORIES[sigIdx];
    setPreview(generateLetter(type, emp, extra, compRows, sig.name, sig.title));
  };

  const IS = {width:"100%", padding:"8px 10px", border:"1px solid #E2D8EE", borderRadius:"8px", fontSize:"12.5px", color:"#1E1428", background:"#fff"};
  const LS = {display:"block" as const, fontSize:"11px", fontWeight:"600" as const, color:"#5C5470", textTransform:"uppercase" as const, marginBottom:"4px"};

  return (
    <div style={{minHeight:"100vh", background:"#F5F3FA", fontFamily:"sans-serif"}}>
      <div style={{background:"#fff", borderBottom:"1px solid #E2D8EE", padding:"14px 28px", display:"flex", alignItems:"center", gap:"16px"}}>
        <div style={{width:"36px", height:"36px", borderRadius:"10px", background:"linear-gradient(135deg,#6F32B3,#B770CE)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:"800", fontSize:"18px"}}>S</div>
        <div><div style={{fontWeight:"700", fontSize:"16px", color:"#1E1428"}}>SiyanTech Business OS</div><div style={{fontSize:"11px", color:"#5C5470"}}>SiyanTech Global Innovations Pvt. Ltd.</div></div>
        <div style={{marginLeft:"auto"}}><a href="/dashboard" style={{fontSize:"13px", color:"#6F32B3", textDecoration:"none"}}>← Dashboard</a></div>
      </div>
      <div style={{display:"flex"}}>
        <div style={{width:"220px", background:"#2C1463", minHeight:"calc(100vh - 65px)", padding:"20px 12px"}}>
          {[{icon:"◧",label:"Dashboard",href:"/dashboard"},{icon:"⏱",label:"Attendance",href:"/attendance"},{icon:"✈",label:"Leaves",href:"/leaves"},{icon:"☰",label:"Employees",href:"/employees"},{icon:"✉",label:"HR Letters",href:"/hr-letters",active:true},{icon:"◈",label:"Leads",href:"/leads"},{icon:"₹",label:"Invoices",href:"/invoices"},{icon:"▤",label:"Expenses",href:"/expenses"},{icon:"▦",label:"Payroll",href:"/payroll"}].map(item=>(
            <a key={item.href} href={item.href} style={{display:"flex",alignItems:"center",gap:"10px",padding:"10px 12px",borderRadius:"9px",marginBottom:"4px",color:item.active?"#fff":"rgba(255,255,255,0.7)",background:item.active?"rgba(255,255,255,0.15)":"transparent",textDecoration:"none",fontSize:"13.5px",fontWeight:item.active?"600":"400"}}>
              <span>{item.icon}</span><span>{item.label}</span>
            </a>
          ))}
        </div>
        <div style={{flex:1, padding:"28px"}}>
          <h2 style={{fontSize:"22px", fontWeight:"700", color:"#1E1428", marginBottom:"4px"}}>HR Letters</h2>
          <p style={{fontSize:"13px", color:"#5C5470", marginBottom:"20px"}}>Generate official letters on SiyanTech letterhead</p>
          <div style={{display:"grid", gridTemplateColumns:"380px 1fr", gap:"24px", alignItems:"start"}}>

            {/* FORM */}
            <div style={{background:"#fff", border:"1px solid #E2D8EE", borderRadius:"14px", padding:"20px", maxHeight:"90vh", overflowY:"auto"}}>

              <div style={{marginBottom:"16px"}}>
                <label style={LS}>Letter Type</label>
                <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px"}}>
                  {LETTER_TYPES.map(lt=>(
                    <button key={lt.value} onClick={()=>{setType(lt.value);setPreview("");}}
                      style={{padding:"9px 8px",borderRadius:"9px",border:`2px solid ${type===lt.value?"#6F32B3":"#E2D8EE"}`,background:type===lt.value?"#F7F4FE":"#fff",color:type===lt.value?"#6F32B3":"#5C5470",fontSize:"12px",fontWeight:type===lt.value?"700":"500",cursor:"pointer",textAlign:"center"}}>
                      {lt.icon} {lt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{marginBottom:"14px"}}>
                <label style={LS}>Authorised Signatory</label>
                <select value={sigIdx} onChange={e=>setSigIdx(+e.target.value)} style={IS}>
                  {SIGNATORIES.map((s,i)=><option key={i} value={i}>{s.name} — {s.title}</option>)}
                </select>
              </div>

              {type!=="offer" && (
                <div style={{marginBottom:"14px"}}>
                  <label style={LS}>Employee</label>
                  <select value={empId} onChange={e=>updateEmp(e.target.value)} style={IS}>
                    {EMPLOYEES.map(e=><option key={e.id} value={e.id}>{e.fullName} — {e.designation}</option>)}
                  </select>
                </div>
              )}

              <div style={{marginBottom:"14px"}}>
                <label style={LS}>Opening Description (leave blank for default)</label>
                <textarea value={extra.description||""} onChange={e=>setEx("description",e.target.value)}
                  placeholder="Leave blank to use default paragraph..." rows={3}
                  style={{...IS, resize:"vertical" as const}} />
              </div>

              {type==="offer" && (<>
                {[
                  {k:"candidateName",l:"Candidate Name",p:"Suresh Naidu"},
                  {k:"address",l:"Address",p:"Visakhapatnam, AP"},
                  {k:"role",l:"Designation",p:"Senior Python Developer"},
                  {k:"dept",l:"Department",p:"Software Engineering"},
                  {k:"empType",l:"Employment Type",p:"Full Time"},
                  {k:"joiningDate",l:"Date of Joining",p:"01st July 2026"},
                  {k:"reportingTo",l:"Reporting To",p:"HR Manager / Managing Director"},
                  {k:"ctc",l:"Annual CTC (₹)",p:"1450000"},
                ].map(f=>(
                  <div key={f.k} style={{marginBottom:"11px"}}>
                    <label style={LS}>{f.l}</label>
                    <input placeholder={f.p} value={extra[f.k]||""} onChange={e=>setEx(f.k,e.target.value)} style={IS} />
                  </div>
                ))}
              </>)}

              {(type==="experience"||type==="relieving") && (
                <div style={{marginBottom:"12px"}}>
                  <label style={LS}>Last Working Day</label>
                  <input placeholder="23rd February 2026" value={extra.lastDay||""} onChange={e=>setEx("lastDay",e.target.value)} style={IS} />
                </div>
              )}
              {type==="appointment" && (
                <div style={{marginBottom:"12px"}}>
                  <label style={LS}>Date of Joining</label>
                  <input placeholder="01st July 2026" value={extra.joiningDate||""} onChange={e=>setEx("joiningDate",e.target.value)} style={IS} />
                </div>
              )}

              {(type==="offer"||type==="appointment") && (
                <div style={{marginBottom:"14px"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"8px"}}>
                    <label style={{...LS,marginBottom:0}}>Compensation Components</label>
                    <button onClick={addRow} style={{background:"#F7F4FE",color:"#6F32B3",border:"1px solid #E2D8EE",borderRadius:"7px",padding:"4px 10px",fontSize:"11.5px",fontWeight:"600",cursor:"pointer"}}>+ Add Row</button>
                  </div>
                  {compRows.map((row,i)=>(
                    <div key={i} style={{display:"grid",gridTemplateColumns:"2fr 1fr 1fr 28px",gap:"5px",marginBottom:"6px",alignItems:"center"}}>
                      <input value={row.label} onChange={e=>updateRow(i,"label",e.target.value)} style={{...IS,fontSize:"11px"}} />
                      <input type="number" value={row.monthly||""} placeholder="Monthly" onChange={e=>updateRow(i,"monthly",e.target.value)} style={{...IS,fontSize:"11px"}} />
                      <input type="number" value={row.annual||""} placeholder="Annual" onChange={e=>updateRow(i,"annual",e.target.value)} style={{...IS,fontSize:"11px"}} />
                      <button onClick={()=>removeRow(i)} style={{background:"#FBE7EB",color:"#D6455D",border:"none",borderRadius:"6px",width:"28px",height:"34px",fontSize:"15px",cursor:"pointer",fontWeight:"700"}}>×</button>
                    </div>
                  ))}
                  <div style={{fontSize:"11px",color:"#5C5470",marginTop:"4px"}}>
                    Total monthly: <b>₹{compRows.reduce((s,r)=>s+r.monthly,0).toLocaleString("en-IN")}</b> &nbsp;|&nbsp; Annual: <b>₹{compRows.reduce((s,r)=>s+r.annual,0).toLocaleString("en-IN")}</b>
                  </div>
                </div>
              )}

              <div style={{display:"flex",gap:"8px",marginTop:"10px"}}>
                <button onClick={generate} style={{flex:1,background:"linear-gradient(135deg,#6F32B3,#B770CE)",color:"#fff",border:"none",borderRadius:"10px",padding:"12px",fontSize:"14px",fontWeight:"600",cursor:"pointer"}}>
                  Generate Preview
                </button>
                <button onClick={downloadPDF} style={{flex:1,background:"linear-gradient(135deg,#0E9F6E,#057A55)",color:"#fff",border:"none",borderRadius:"10px",padding:"12px",fontSize:"14px",fontWeight:"600",cursor:"pointer"}}>
                  ⬇ Download PDF
                </button>
              </div>
            </div>

            {/* PREVIEW */}
            <div>
              {preview ? (
                <>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"12px"}}>
                    <div style={{fontWeight:"600",color:"#1E1428"}}>Preview — official SiyanTech letterhead</div>
                    <button onClick={()=>window.print()} style={{background:"linear-gradient(135deg,#6F32B3,#B770CE)",color:"#fff",border:"none",borderRadius:"9px",padding:"8px 16px",fontSize:"13px",fontWeight:"600",cursor:"pointer"}}>🖨 Print</button>
                  </div>
                  <div style={{border:"1px solid #E2D8EE",borderRadius:"14px",overflow:"hidden",boxShadow:"0 8px 32px rgba(44,20,99,.12)"}}>
                    <div dangerouslySetInnerHTML={{__html:preview}} />
                  </div>
                </>
              ) : (
                <div style={{background:"#fff",border:"1px solid #E2D8EE",borderRadius:"14px",padding:"80px",textAlign:"center"}}>
                  <div style={{fontSize:"48px",marginBottom:"16px"}}>✉</div>
                  <div style={{fontSize:"16px",fontWeight:"600",color:"#1E1428",marginBottom:"8px"}}>Fill the form and click Generate Preview</div>
                  <div style={{fontSize:"13px",color:"#5C5470"}}>Use Download PDF for the final multi-page A4 PDF with letterhead on every page</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
