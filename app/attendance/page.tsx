"use client";
import { useState } from "react";

const EMPLOYEES = [
  {id:"1", empCode:"2701", fullName:"Chakradhar Tatikonda", designation:"Managing Director"},
  {id:"2", empCode:"2702", fullName:"Mohan Shesetty", designation:"Managing Director"},
  {id:"3", empCode:"2703", fullName:"Sri Sai Kadiyam", designation:"Sr. DevOps Engineer"},
  {id:"4", empCode:"2704", fullName:"Priya Vemula", designation:"Python Developer"},
  {id:"5", empCode:"2705", fullName:"Rakesh Pashikanti", designation:"Finance Executive"},
  {id:"6", empCode:"2706", fullName:"Anusha Rayudu", designation:"HR & Recruitment"},
  {id:"7", empCode:"2707", fullName:"Kiran Bose", designation:"BPO Team Lead"},
];

type Status = "PRESENT"|"LATE"|"ABSENT"|"WFH"|"ON_LEAVE"|"HALF_DAY";

const STATUS_COLORS: Record<Status,{bg:string,color:string}> = {
  PRESENT:  {bg:"#E3F6EE", color:"#0E9F6E"},
  LATE:     {bg:"#FCF0DC", color:"#C77B0A"},
  ABSENT:   {bg:"#FBE7EB", color:"#D6455D"},
  WFH:      {bg:"#EDE9FE", color:"#6F32B3"},
  ON_LEAVE: {bg:"#E0F2FE", color:"#0369A1"},
  HALF_DAY: {bg:"#FEF3C7", color:"#92400E"},
};

// June 2026 register — realistic data
const REGISTER: Record<string, Record<number, Status>> = {
  "1": {1:"PRESENT",2:"PRESENT",3:"PRESENT",4:"ABSENT",5:"PRESENT",6:"PRESENT",7:"PRESENT",8:"WFH",9:"PRESENT",10:"PRESENT",11:"PRESENT",12:"PRESENT"},
  "2": {1:"PRESENT",2:"PRESENT",3:"WFH",4:"PRESENT",5:"PRESENT",6:"PRESENT",7:"PRESENT",8:"PRESENT",9:"PRESENT",10:"PRESENT",11:"PRESENT",12:"PRESENT"},
  "3": {1:"PRESENT",2:"PRESENT",3:"PRESENT",4:"PRESENT",5:"PRESENT",6:"PRESENT",7:"PRESENT",8:"PRESENT",9:"PRESENT",10:"WFH",11:"PRESENT",12:"PRESENT"},
  "4": {1:"PRESENT",2:"PRESENT",3:"PRESENT",4:"PRESENT",5:"ON_LEAVE",6:"PRESENT",7:"PRESENT",8:"PRESENT",9:"PRESENT",10:"PRESENT",11:"PRESENT",12:"PRESENT"},
  "5": {1:"PRESENT",2:"LATE",3:"PRESENT",4:"PRESENT",5:"PRESENT",6:"PRESENT",7:"PRESENT",8:"PRESENT",9:"PRESENT",10:"PRESENT",11:"PRESENT",12:"PRESENT"},
  "6": {1:"PRESENT",2:"PRESENT",3:"PRESENT",4:"PRESENT",5:"PRESENT",6:"PRESENT",7:"PRESENT",8:"ON_LEAVE",9:"PRESENT",10:"PRESENT",11:"PRESENT",12:"PRESENT"},
  "7": {1:"PRESENT",2:"PRESENT",3:"ABSENT",4:"PRESENT",5:"PRESENT",6:"PRESENT",7:"PRESENT",8:"PRESENT",9:"ABSENT",10:"PRESENT",11:"PRESENT",12:"PRESENT"},
};

// Today's check-in times
const CHECKINS: Record<string,{in?:string,out?:string}> = {
  "2": {in:"09:21"}, "3": {in:"09:34"}, "4": {in:"09:12"},
  "5": {in:"09:48"}, "6": {in:"09:05"},
};

export default function AttendancePage() {
  const [checkins, setCheckins] = useState(CHECKINS);
  const [tab, setTab] = useState<"today"|"register">("today");
  const today = 12; // June 12

  const checkIn = (id: string) => {
    const now = new Date();
    const time = now.getHours().toString().padStart(2,"0")+":"+now.getMinutes().toString().padStart(2,"0");
    setCheckins(prev => ({...prev, [id]: {in: time}}));
  };

  const checkOut = (id: string) => {
    const now = new Date();
    const time = now.getHours().toString().padStart(2,"0")+":"+now.getMinutes().toString().padStart(2,"0");
    setCheckins(prev => ({...prev, [id]: {...prev[id], out: time}}));
  };

  const getStatus = (id: string): Status => {
    if (!checkins[id]?.in) return "ABSENT";
    const [h,m] = (checkins[id].in||"").split(":").map(Number);
    return (h > 9 || (h===9 && m > 30)) ? "LATE" : "PRESENT";
  };

  const presentCount = EMPLOYEES.filter(e => checkins[e.id]?.in).length;

  // Sundays in June 2026: 7, 14, 21, 28
  const sundays = [7,14,21,28];
  const days = Array.from({length:today}, (_,i) => i+1);

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
            {icon:"⏱", label:"Attendance", href:"/attendance", active:true},
            {icon:"✈", label:"Leaves", href:"/leaves"},
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
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px"}}>
            <div>
              <h2 style={{fontSize:"22px", fontWeight:"700", color:"#1E1428"}}>Attendance</h2>
              <p style={{fontSize:"13px", color:"#5C5470", marginTop:"2px"}}>Friday, 12 June 2026 · {presentCount} of {EMPLOYEES.length} present</p>
            </div>
            <div style={{display:"flex", gap:"8px"}}>
              {(["today","register"] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  style={{padding:"9px 18px", borderRadius:"9px", border:"none", fontWeight:"600", fontSize:"13px", cursor:"pointer", background:tab===t?"linear-gradient(135deg,#6F32B3,#B770CE)":"#fff", color:tab===t?"#fff":"#5C5470", boxShadow:"0 1px 3px rgba(44,20,99,.1)"}}>
                  {t === "today" ? "Today" : "Monthly Register"}
                </button>
              ))}
            </div>
          </div>

          {/* Summary cards */}
          <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"14px", marginBottom:"24px"}}>
            {[
              {label:"Present", value:presentCount, color:"#0E9F6E", bg:"#E3F6EE"},
              {label:"Absent / Not in", value:EMPLOYEES.length-presentCount, color:"#D6455D", bg:"#FBE7EB"},
              {label:"On Leave", value:0, color:"#0369A1", bg:"#E0F2FE"},
              {label:"WFH", value:0, color:"#6F32B3", bg:"#EDE9FE"},
            ].map(k => (
              <div key={k.label} style={{background:"#fff", border:"1px solid #E2D8EE", borderRadius:"14px", padding:"16px"}}>
                <div style={{fontSize:"11px", fontWeight:"600", color:"#5C5470", textTransform:"uppercase"}}>{k.label}</div>
                <div style={{fontSize:"28px", fontWeight:"800", color:k.color, marginTop:"4px"}}>{k.value}</div>
              </div>
            ))}
          </div>

          {/* Today tab */}
          {tab === "today" && (
            <div style={{background:"#fff", border:"1px solid #E2D8EE", borderRadius:"14px", overflow:"hidden"}}>
              <table style={{width:"100%", borderCollapse:"collapse", fontSize:"13.5px"}}>
                <thead>
                  <tr style={{background:"#7B3CC4"}}>
                    {["Employee","Check In","Check Out","Hours","Status","Action"].map(h => (
                      <th key={h} style={{padding:"11px 14px", textAlign:"left", color:"#fff", fontSize:"11px", fontWeight:"600", letterSpacing:"0.07em", textTransform:"uppercase"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {EMPLOYEES.map((emp, i) => {
                    const ci = checkins[emp.id];
                    const status = getStatus(emp.id);
                    const sc = STATUS_COLORS[status];
                    const hours = ci?.in && ci?.out ? "8h 0m" : ci?.in ? "In progress" : "—";
                    return (
                      <tr key={emp.id} style={{borderBottom:"1px solid #E2D8EE", background:i%2===0?"#fff":"#F8F2FB"}}>
                        <td style={{padding:"12px 14px"}}>
                          <div style={{fontWeight:"600", color:"#1E1428"}}>{emp.fullName}</div>
                          <div style={{fontSize:"11px", color:"#5C5470"}}>{emp.designation}</div>
                        </td>
                        <td style={{padding:"12px 14px", fontFamily:"monospace", color:ci?.in?"#1E1428":"#C9C2DE"}}>{ci?.in||"—"}</td>
                        <td style={{padding:"12px 14px", fontFamily:"monospace", color:ci?.out?"#1E1428":"#C9C2DE"}}>{ci?.out||"—"}</td>
                        <td style={{padding:"12px 14px", color:"#5C5470"}}>{hours}</td>
                        <td style={{padding:"12px 14px"}}>
                          <span style={{background:sc.bg, color:sc.color, padding:"3px 10px", borderRadius:"99px", fontSize:"11.5px", fontWeight:"600"}}>
                            {ci?.in ? status : "NOT IN"}
                          </span>
                        </td>
                        <td style={{padding:"12px 14px"}}>
                          {!ci?.in ? (
                            <button onClick={() => checkIn(emp.id)}
                              style={{background:"#E3F6EE", color:"#0E9F6E", border:"none", borderRadius:"7px", padding:"6px 12px", fontSize:"12px", fontWeight:"600", cursor:"pointer"}}>
                              Check In
                            </button>
                          ) : !ci?.out ? (
                            <button onClick={() => checkOut(emp.id)}
                              style={{background:"#FBE7EB", color:"#D6455D", border:"none", borderRadius:"7px", padding:"6px 12px", fontSize:"12px", fontWeight:"600", cursor:"pointer"}}>
                              Check Out
                            </button>
                          ) : (
                            <span style={{fontSize:"12px", color:"#0E9F6E", fontWeight:"600"}}>✓ Done</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Monthly register tab */}
          {tab === "register" && (
            <div style={{background:"#fff", border:"1px solid #E2D8EE", borderRadius:"14px", overflow:"auto"}}>
              <table style={{borderCollapse:"collapse", fontSize:"12px", minWidth:"900px"}}>
                <thead>
                  <tr style={{background:"#7B3CC4"}}>
                    <th style={{padding:"10px 14px", textAlign:"left", color:"#fff", fontSize:"11px", fontWeight:"600", position:"sticky", left:0, background:"#7B3CC4", minWidth:"160px"}}>Employee</th>
                    {days.map(d => (
                      <th key={d} style={{padding:"8px 6px", color:"#fff", fontSize:"10px", fontWeight:"600", textAlign:"center", width:"32px", background:sundays.includes(d)?"#5a2a9a":"#7B3CC4"}}>
                        {d}
                      </th>
                    ))}
                    <th style={{padding:"10px 10px", color:"#fff", fontSize:"10px", fontWeight:"600"}}>P</th>
                    <th style={{padding:"10px 10px", color:"#fff", fontSize:"10px", fontWeight:"600"}}>A</th>
                    <th style={{padding:"10px 10px", color:"#fff", fontSize:"10px", fontWeight:"600"}}>L</th>
                  </tr>
                </thead>
                <tbody>
                  {EMPLOYEES.map((emp, ri) => {
                    const reg = REGISTER[emp.id] || {};
                    const present = days.filter(d => !sundays.includes(d) && reg[d] === "PRESENT").length;
                    const absent = days.filter(d => !sundays.includes(d) && reg[d] === "ABSENT").length;
                    const leave = days.filter(d => !sundays.includes(d) && reg[d] === "ON_LEAVE").length;
                    return (
                      <tr key={emp.id} style={{borderBottom:"1px solid #E2D8EE", background:ri%2===0?"#fff":"#F8F2FB"}}>
                        <td style={{padding:"10px 14px", fontWeight:"600", color:"#1E1428", position:"sticky", left:0, background:ri%2===0?"#fff":"#F8F2FB"}}>
                          {emp.fullName}
                          <div style={{fontSize:"10px", color:"#5C5470"}}>{emp.designation}</div>
                        </td>
                        {days.map(d => {
                          const s = sundays.includes(d) ? "SUN" : reg[d];
                          const colors: Record<string,{bg:string,color:string}> = {
                            PRESENT:{bg:"#E3F6EE",color:"#0E9F6E"},
                            ABSENT:{bg:"#FBE7EB",color:"#D6455D"},
                            ON_LEAVE:{bg:"#E0F2FE",color:"#0369A1"},
                            WFH:{bg:"#EDE9FE",color:"#6F32B3"},
                            LATE:{bg:"#FCF0DC",color:"#C77B0A"},
                            SUN:{bg:"#F1F5F9",color:"#94A3B8"},
                          };
                          const c = colors[s||"PRESENT"] || colors.PRESENT;
                          const label = s==="PRESENT"?"P":s==="ABSENT"?"A":s==="ON_LEAVE"?"L":s==="WFH"?"W":s==="LATE"?"L8":s==="SUN"?"S":"P";
                          return (
                            <td key={d} style={{padding:"4px 3px", textAlign:"center"}}>
                              <div style={{background:c.bg, color:c.color, borderRadius:"4px", padding:"3px 0", fontSize:"9px", fontWeight:"700", width:"24px", margin:"0 auto"}}>{label}</div>
                            </td>
                          );
                        })}
                        <td style={{padding:"10px 8px", textAlign:"center", fontWeight:"700", color:"#0E9F6E"}}>{present}</td>
                        <td style={{padding:"10px 8px", textAlign:"center", fontWeight:"700", color:"#D6455D"}}>{absent}</td>
                        <td style={{padding:"10px 8px", textAlign:"center", fontWeight:"700", color:"#0369A1"}}>{leave}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {/* Legend */}
              <div style={{padding:"12px 16px", borderTop:"1px solid #E2D8EE", display:"flex", gap:"16px", flexWrap:"wrap"}}>
                {[{l:"P — Present",c:"#0E9F6E"},{l:"A — Absent (LOP)",c:"#D6455D"},{l:"L — Leave",c:"#0369A1"},{l:"W — WFH",c:"#6F32B3"},{l:"L8 — Late",c:"#C77B0A"},{l:"S — Sunday",c:"#94A3B8"}].map(x => (
                  <span key={x.l} style={{fontSize:"11px", color:x.c, fontWeight:"600"}}>{x.l}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
