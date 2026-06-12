"use client";
import { useState } from "react";

const EMPLOYEES = [
  {id:"1", fullName:"Chakradhar Tatikonda", designation:"Managing Director"},
  {id:"2", fullName:"Mohan Shesetty", designation:"Managing Director"},
  {id:"3", fullName:"Sri Sai Kadiyam", designation:"Sr. DevOps Engineer"},
  {id:"4", fullName:"Priya Vemula", designation:"Python Developer"},
  {id:"5", fullName:"Rakesh Pashikanti", designation:"Finance Executive"},
  {id:"6", fullName:"Anusha Rayudu", designation:"HR & Recruitment"},
  {id:"7", fullName:"Kiran Bose", designation:"BPO Team Lead"},
];

type LeaveStatus = "PENDING"|"APPROVED"|"REJECTED";

interface Leave {
  id: string;
  empId: string;
  empName: string;
  designation: string;
  type: string;
  from: string;
  to: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  applied: string;
}

const INITIAL_LEAVES: Leave[] = [
  {id:"1", empId:"4", empName:"Priya Vemula", designation:"Python Developer", type:"Casual", from:"16-Jun-2026", to:"17-Jun-2026", days:2, reason:"Personal work", status:"PENDING", applied:"10-Jun-2026"},
  {id:"2", empId:"7", empName:"Kiran Bose", designation:"BPO Team Lead", type:"Sick", from:"13-Jun-2026", to:"13-Jun-2026", days:1, reason:"Not feeling well", status:"PENDING", applied:"11-Jun-2026"},
  {id:"3", empId:"6", empName:"Anusha Rayudu", designation:"HR & Recruitment", type:"Casual", from:"08-Jun-2026", to:"08-Jun-2026", days:1, reason:"Family function", status:"APPROVED", applied:"05-Jun-2026"},
  {id:"4", empId:"3", empName:"Sri Sai Kadiyam", designation:"Sr. DevOps Engineer", type:"Earned", from:"01-Jun-2026", to:"02-Jun-2026", days:2, reason:"Vacation", status:"APPROVED", applied:"28-May-2026"},
  {id:"5", empId:"5", empName:"Rakesh Pashikanti", designation:"Finance Executive", type:"Sick", from:"20-May-2026", to:"20-May-2026", days:1, reason:"Fever", status:"REJECTED", applied:"20-May-2026"},
];

const BALANCES = [
  {empId:"1", name:"Chakradhar Tatikonda", casual:8, sick:6, earned:12, usedC:0, usedS:0, usedE:0},
  {empId:"2", name:"Mohan Shesetty", casual:8, sick:6, earned:12, usedC:0, usedS:0, usedE:0},
  {empId:"3", name:"Sri Sai Kadiyam", casual:8, sick:6, earned:12, usedC:0, usedS:0, usedE:2},
  {empId:"4", name:"Priya Vemula", casual:8, sick:6, earned:12, usedC:0, usedS:0, usedE:0},
  {empId:"5", name:"Rakesh Pashikanti", casual:8, sick:6, earned:12, usedC:0, usedS:1, usedE:0},
  {empId:"6", name:"Anusha Rayudu", casual:8, sick:6, earned:12, usedC:1, usedS:0, usedE:0},
  {empId:"7", name:"Kiran Bose", casual:8, sick:6, earned:12, usedC:0, usedS:0, usedE:0},
];

const STATUS_COLORS: Record<LeaveStatus,{bg:string,color:string}> = {
  PENDING:  {bg:"#FCF0DC", color:"#C77B0A"},
  APPROVED: {bg:"#E3F6EE", color:"#0E9F6E"},
  REJECTED: {bg:"#FBE7EB", color:"#D6455D"},
};

const TYPE_COLORS: Record<string,{bg:string,color:string}> = {
  Casual:  {bg:"#EDE9FE", color:"#6F32B3"},
  Sick:    {bg:"#E0F2FE", color:"#0369A1"},
  Earned:  {bg:"#F0FDF4", color:"#15803D"},
};

export default function LeavesPage() {
  const [leaves, setLeaves] = useState<Leave[]>(INITIAL_LEAVES);
  const [tab, setTab] = useState<"requests"|"balances"|"apply">("requests");
  const [filter, setFilter] = useState<"ALL"|LeaveStatus>("ALL");
  const [showApply, setShowApply] = useState(false);
  const [form, setForm] = useState({empId:"4", type:"Casual", from:"", to:"", reason:""});

  const pending = leaves.filter(l => l.status === "PENDING").length;

  const filtered = filter === "ALL" ? leaves : leaves.filter(l => l.status === filter);

  const approve = (id: string) => {
    setLeaves(prev => prev.map(l => l.id === id ? {...l, status:"APPROVED"} : l));
  };

  const reject = (id: string) => {
    setLeaves(prev => prev.map(l => l.id === id ? {...l, status:"REJECTED"} : l));
  };

  const applyLeave = () => {
    const emp = EMPLOYEES.find(e => e.id === form.empId)!;
    const newLeave: Leave = {
      id: String(leaves.length + 1),
      empId: form.empId,
      empName: emp.fullName,
      designation: emp.designation,
      type: form.type,
      from: form.from,
      to: form.to,
      days: 1,
      reason: form.reason,
      status: "PENDING",
      applied: "12-Jun-2026",
    };
    setLeaves(prev => [newLeave, ...prev]);
    setShowApply(false);
    setTab("requests");
    setFilter("PENDING");
  };

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
            {icon:"✈", label:"Leaves", href:"/leaves", active:true},
            {icon:"☰", label:"Employees", href:"/employees"},
            {icon:"✉", label:"HR Letters", href:"/hr-letters"},
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

          {/* Header */}
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px"}}>
            <div>
              <h2 style={{fontSize:"22px", fontWeight:"700", color:"#1E1428"}}>Leave Management</h2>
              <p style={{fontSize:"13px", color:"#5C5470", marginTop:"2px"}}>
                {pending > 0 ? <span style={{color:"#C77B0A", fontWeight:"600"}}>{pending} pending approval</span> : "All requests processed"}
              </p>
            </div>
            <button onClick={() => setShowApply(true)}
              style={{background:"linear-gradient(135deg,#6F32B3,#B770CE)", color:"#fff", border:"none", borderRadius:"10px", padding:"10px 20px", fontSize:"14px", fontWeight:"600", cursor:"pointer"}}>
              + Apply Leave
            </button>
          </div>

          {/* Summary cards */}
          <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"14px", marginBottom:"24px"}}>
            {[
              {label:"Total Requests", value:leaves.length, color:"#6F32B3"},
              {label:"Pending", value:leaves.filter(l=>l.status==="PENDING").length, color:"#C77B0A"},
              {label:"Approved", value:leaves.filter(l=>l.status==="APPROVED").length, color:"#0E9F6E"},
              {label:"Rejected", value:leaves.filter(l=>l.status==="REJECTED").length, color:"#D6455D"},
            ].map(k => (
              <div key={k.label} style={{background:"#fff", border:"1px solid #E2D8EE", borderRadius:"14px", padding:"16px"}}>
                <div style={{fontSize:"11px", fontWeight:"600", color:"#5C5470", textTransform:"uppercase"}}>{k.label}</div>
                <div style={{fontSize:"28px", fontWeight:"800", color:k.color, marginTop:"4px"}}>{k.value}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{display:"flex", gap:"8px", marginBottom:"16px"}}>
            {(["requests","balances"] as const).map(t => (
              <button key={t} onClick={() => setTab(t)}
                style={{padding:"9px 18px", borderRadius:"9px", border:"none", fontWeight:"600", fontSize:"13px", cursor:"pointer", background:tab===t?"linear-gradient(135deg,#6F32B3,#B770CE)":"#fff", color:tab===t?"#fff":"#5C5470", boxShadow:"0 1px 3px rgba(44,20,99,.1)"}}>
                {t === "requests" ? "Leave Requests" : "Leave Balances"}
              </button>
            ))}

            {tab === "requests" && (
              <div style={{marginLeft:"auto", display:"flex", gap:"6px"}}>
                {(["ALL","PENDING","APPROVED","REJECTED"] as const).map(f => (
                  <button key={f} onClick={() => setFilter(f)}
                    style={{padding:"7px 14px", borderRadius:"8px", border:`1px solid ${filter===f?"#6F32B3":"#E2D8EE"}`, background:filter===f?"#F7F4FE":"#fff", color:filter===f?"#6F32B3":"#5C5470", fontSize:"12px", fontWeight:filter===f?"700":"500", cursor:"pointer"}}>
                    {f}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Leave requests table */}
          {tab === "requests" && (
            <div style={{background:"#fff", border:"1px solid #E2D8EE", borderRadius:"14px", overflow:"hidden"}}>
              <table style={{width:"100%", borderCollapse:"collapse", fontSize:"13px"}}>
                <thead>
                  <tr style={{background:"#7B3CC4"}}>
                    {["Employee","Type","Dates","Days","Reason","Applied","Status","Action"].map(h => (
                      <th key={h} style={{padding:"11px 14px", textAlign:"left", color:"#fff", fontSize:"11px", fontWeight:"600", letterSpacing:"0.07em", textTransform:"uppercase"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((leave, i) => {
                    const sc = STATUS_COLORS[leave.status];
                    const tc = TYPE_COLORS[leave.type] || TYPE_COLORS.Casual;
                    return (
                      <tr key={leave.id} style={{borderBottom:"1px solid #E2D8EE", background:i%2===0?"#fff":"#F8F2FB"}}>
                        <td style={{padding:"12px 14px"}}>
                          <div style={{fontWeight:"600", color:"#1E1428"}}>{leave.empName}</div>
                          <div style={{fontSize:"11px", color:"#5C5470"}}>{leave.designation}</div>
                        </td>
                        <td style={{padding:"12px 14px"}}>
                          <span style={{background:tc.bg, color:tc.color, padding:"3px 10px", borderRadius:"99px", fontSize:"11.5px", fontWeight:"600"}}>
                            {leave.type}
                          </span>
                        </td>
                        <td style={{padding:"12px 14px", fontSize:"12px"}}>
                          <div>{leave.from}</div>
                          {leave.from !== leave.to && <div style={{color:"#5C5470"}}>to {leave.to}</div>}
                        </td>
                        <td style={{padding:"12px 14px", fontWeight:"600", textAlign:"center"}}>{leave.days}</td>
                        <td style={{padding:"12px 14px", color:"#5C5470", maxWidth:"160px"}}>{leave.reason}</td>
                        <td style={{padding:"12px 14px", fontSize:"12px", color:"#5C5470"}}>{leave.applied}</td>
                        <td style={{padding:"12px 14px"}}>
                          <span style={{background:sc.bg, color:sc.color, padding:"3px 10px", borderRadius:"99px", fontSize:"11.5px", fontWeight:"600"}}>
                            {leave.status}
                          </span>
                        </td>
                        <td style={{padding:"12px 14px"}}>
                          {leave.status === "PENDING" && (
                            <div style={{display:"flex", gap:"6px"}}>
                              <button onClick={() => approve(leave.id)}
                                style={{background:"#E3F6EE", color:"#0E9F6E", border:"none", borderRadius:"7px", padding:"5px 10px", fontSize:"12px", fontWeight:"600", cursor:"pointer"}}>
                                ✓ Approve
                              </button>
                              <button onClick={() => reject(leave.id)}
                                style={{background:"#FBE7EB", color:"#D6455D", border:"none", borderRadius:"7px", padding:"5px 10px", fontSize:"12px", fontWeight:"600", cursor:"pointer"}}>
                                ✗ Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Leave balances */}
          {tab === "balances" && (
            <div style={{background:"#fff", border:"1px solid #E2D8EE", borderRadius:"14px", overflow:"hidden"}}>
              <table style={{width:"100%", borderCollapse:"collapse", fontSize:"13px"}}>
                <thead>
                  <tr style={{background:"#7B3CC4"}}>
                    {["Employee","Casual (8)","Used","Balance","Sick (6)","Used","Balance","Earned (12)","Used","Balance"].map(h => (
                      <th key={h} style={{padding:"11px 10px", textAlign:"center", color:"#fff", fontSize:"10px", fontWeight:"600", letterSpacing:"0.07em", textTransform:"uppercase"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {BALANCES.map((b, i) => (
                    <tr key={b.empId} style={{borderBottom:"1px solid #E2D8EE", background:i%2===0?"#fff":"#F8F2FB"}}>
                      <td style={{padding:"12px 14px", fontWeight:"600", color:"#1E1428"}}>{b.name}</td>
                      <td style={{padding:"10px", textAlign:"center", color:"#6F32B3", fontWeight:"700"}}>{b.casual}</td>
                      <td style={{padding:"10px", textAlign:"center", color:"#D6455D"}}>{b.usedC}</td>
                      <td style={{padding:"10px", textAlign:"center", fontWeight:"700", color:"#0E9F6E"}}>{b.casual-b.usedC}</td>
                      <td style={{padding:"10px", textAlign:"center", color:"#6F32B3", fontWeight:"700"}}>{b.sick}</td>
                      <td style={{padding:"10px", textAlign:"center", color:"#D6455D"}}>{b.usedS}</td>
                      <td style={{padding:"10px", textAlign:"center", fontWeight:"700", color:"#0E9F6E"}}>{b.sick-b.usedS}</td>
                      <td style={{padding:"10px", textAlign:"center", color:"#6F32B3", fontWeight:"700"}}>{b.earned}</td>
                      <td style={{padding:"10px", textAlign:"center", color:"#D6455D"}}>{b.usedE}</td>
                      <td style={{padding:"10px", textAlign:"center", fontWeight:"700", color:"#0E9F6E"}}>{b.earned-b.usedE}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Apply Leave Modal */}
          {showApply && (
            <div style={{position:"fixed", inset:0, background:"rgba(33,26,53,.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:50}}>
              <div style={{background:"#fff", borderRadius:"16px", padding:"28px", width:"460px", maxWidth:"95vw"}}>
                <div style={{fontWeight:"700", fontSize:"17px", color:"#1E1428", marginBottom:"20px"}}>Apply Leave</div>
                <div style={{display:"grid", gap:"14px"}}>
                  <div>
                    <label style={{display:"block", fontSize:"11px", fontWeight:"600", color:"#5C5470", textTransform:"uppercase", marginBottom:"5px"}}>Employee</label>
                    <select value={form.empId} onChange={e => setForm({...form, empId:e.target.value})}
                      style={{width:"100%", padding:"9px 11px", border:"1px solid #E2D8EE", borderRadius:"9px", fontSize:"13px"}}>
                      {EMPLOYEES.map(e => <option key={e.id} value={e.id}>{e.fullName}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{display:"block", fontSize:"11px", fontWeight:"600", color:"#5C5470", textTransform:"uppercase", marginBottom:"5px"}}>Leave Type</label>
                    <select value={form.type} onChange={e => setForm({...form, type:e.target.value})}
                      style={{width:"100%", padding:"9px 11px", border:"1px solid #E2D8EE", borderRadius:"9px", fontSize:"13px"}}>
                      <option>Casual</option>
                      <option>Sick</option>
                      <option>Earned</option>
                    </select>
                  </div>
                  <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"12px"}}>
                    <div>
                      <label style={{display:"block", fontSize:"11px", fontWeight:"600", color:"#5C5470", textTransform:"uppercase", marginBottom:"5px"}}>From Date</label>
                      <input type="date" value={form.from} onChange={e => setForm({...form, from:e.target.value})}
                        style={{width:"100%", padding:"9px 11px", border:"1px solid #E2D8EE", borderRadius:"9px", fontSize:"13px"}} />
                    </div>
                    <div>
                      <label style={{display:"block", fontSize:"11px", fontWeight:"600", color:"#5C5470", textTransform:"uppercase", marginBottom:"5px"}}>To Date</label>
                      <input type="date" value={form.to} onChange={e => setForm({...form, to:e.target.value})}
                        style={{width:"100%", padding:"9px 11px", border:"1px solid #E2D8EE", borderRadius:"9px", fontSize:"13px"}} />
                    </div>
                  </div>
                  <div>
                    <label style={{display:"block", fontSize:"11px", fontWeight:"600", color:"#5C5470", textTransform:"uppercase", marginBottom:"5px"}}>Reason</label>
                    <input placeholder="Reason for leave" value={form.reason} onChange={e => setForm({...form, reason:e.target.value})}
                      style={{width:"100%", padding:"9px 11px", border:"1px solid #E2D8EE", borderRadius:"9px", fontSize:"13px"}} />
                  </div>
                </div>
                <div style={{display:"flex", gap:"10px", marginTop:"20px", justifyContent:"flex-end"}}>
                  <button onClick={() => setShowApply(false)}
                    style={{background:"#F7F4FE", color:"#6F32B3", border:"1px solid #E2D8EE", borderRadius:"9px", padding:"9px 18px", fontSize:"13px", fontWeight:"600", cursor:"pointer"}}>
                    Cancel
                  </button>
                  <button onClick={applyLeave}
                    style={{background:"linear-gradient(135deg,#6F32B3,#B770CE)", color:"#fff", border:"none", borderRadius:"9px", padding:"9px 18px", fontSize:"13px", fontWeight:"600", cursor:"pointer"}}>
                    Submit Request
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
