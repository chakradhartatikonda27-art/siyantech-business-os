"use client";
import { useState } from "react";

const EMPLOYEES = [
  {id:"1", empCode:"2701", fullName:"Chakradhar Tatikonda", designation:"Managing Director", department:"DevOps & Engineering", monthlyGross:166667, status:"ACTIVE", phone:"+91 9390560625", email:"chakradhar@siyantechglobal.com"},
  {id:"2", empCode:"2702", fullName:"Mohan Shesetty", designation:"Managing Director", department:"Operations", monthlyGross:166667, status:"ACTIVE", phone:"+91 6302042599", email:"mohan@siyantechglobal.com"},
  {id:"3", empCode:"2703", fullName:"Sri Sai Kadiyam", designation:"Sr. DevOps Engineer", department:"DevOps & Engineering", monthlyGross:95000, status:"ACTIVE", phone:"", email:""},
  {id:"4", empCode:"2704", fullName:"Priya Vemula", designation:"Python Developer", department:"Software Engineering", monthlyGross:62000, status:"ACTIVE", phone:"", email:""},
  {id:"5", empCode:"2705", fullName:"Rakesh Pashikanti", designation:"Finance Executive", department:"Accounts", monthlyGross:45000, status:"ACTIVE", phone:"", email:""},
  {id:"6", empCode:"2706", fullName:"Anusha Rayudu", designation:"HR & Recruitment", department:"Human Resources", monthlyGross:38000, status:"ACTIVE", phone:"", email:""},
  {id:"7", empCode:"2707", fullName:"Kiran Bose", designation:"BPO Team Lead", department:"BPO Operations", monthlyGross:32000, status:"ACTIVE", phone:"", email:""},
];

const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

export default function EmployeesPage() {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const filtered = EMPLOYEES.filter(e =>
    e.fullName.toLowerCase().includes(search.toLowerCase()) ||
    e.designation.toLowerCase().includes(search.toLowerCase()) ||
    e.department.toLowerCase().includes(search.toLowerCase())
  );

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
            {icon:"☰", label:"Employees", href:"/employees", active:true},
            {icon:"✉", label:"HR Letters", href:"/hr-letters"},
            {icon:"◈", label:"Leads", href:"/leads"},
            {icon:"₹", label:"Invoices", href:"/invoices"},
            {icon:"▤", label:"Expenses", href:"/expenses"},
            {icon:"▦", label:"Payroll", href:"/payroll"},
          ].map((item) => (
            <a key={item.href} href={item.href}
              style={{
                display:"flex", alignItems:"center", gap:"10px",
                padding:"10px 12px", borderRadius:"9px", marginBottom:"4px",
                color: item.active ? "#fff" : "rgba(255,255,255,0.7)",
                background: item.active ? "rgba(255,255,255,0.15)" : "transparent",
                textDecoration:"none", fontSize:"13.5px", fontWeight: item.active ? "600" : "400"
              }}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </div>

        {/* Main */}
        <div style={{flex:1, padding:"28px"}}>

          {/* Header */}
          <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"20px"}}>
            <div>
              <h2 style={{fontSize:"22px", fontWeight:"700", color:"#1E1428"}}>Employees</h2>
              <p style={{fontSize:"13px", color:"#5C5470", marginTop:"2px"}}>{EMPLOYEES.length} active employees</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              style={{background:"linear-gradient(135deg,#6F32B3,#B770CE)", color:"#fff", border:"none", borderRadius:"10px", padding:"10px 20px", fontSize:"14px", fontWeight:"600", cursor:"pointer"}}>
              + Add Employee
            </button>
          </div>

          {/* Search */}
          <div style={{marginBottom:"16px"}}>
            <input
              placeholder="Search by name, designation or department..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{width:"100%", maxWidth:"400px", padding:"10px 14px", border:"1px solid #E2D8EE", borderRadius:"10px", fontSize:"13.5px", outline:"none"}}
            />
          </div>

          {/* Table */}
          <div style={{background:"#fff", border:"1px solid #E2D8EE", borderRadius:"14px", overflow:"hidden"}}>
            <table style={{width:"100%", borderCollapse:"collapse", fontSize:"13.5px"}}>
              <thead>
                <tr style={{background:"#7B3CC4"}}>
                  {["Emp ID","Name","Designation","Department","Monthly Gross","Status",""].map(h => (
                    <th key={h} style={{padding:"11px 14px", textAlign:"left", color:"#fff", fontSize:"11px", fontWeight:"600", letterSpacing:"0.07em", textTransform:"uppercase"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp, i) => (
                  <tr key={emp.id} style={{borderBottom:"1px solid #E2D8EE", background: i%2===0 ? "#fff" : "#F8F2FB"}}>
                    <td style={{padding:"12px 14px", fontFamily:"monospace", fontSize:"12px"}}>{emp.empCode}</td>
                    <td style={{padding:"12px 14px"}}>
                      <div style={{fontWeight:"600", color:"#1E1428"}}>{emp.fullName}</div>
                      <div style={{fontSize:"11px", color:"#5C5470"}}>{emp.email}</div>
                    </td>
                    <td style={{padding:"12px 14px", color:"#1E1428"}}>{emp.designation}</td>
                    <td style={{padding:"12px 14px", color:"#5C5470"}}>{emp.department}</td>
                    <td style={{padding:"12px 14px", fontWeight:"600", color:"#6F32B3"}}>{inr(emp.monthlyGross)}</td>
                    <td style={{padding:"12px 14px"}}>
                      <span style={{background:"#E3F6EE", color:"#0E9F6E", padding:"3px 10px", borderRadius:"99px", fontSize:"11.5px", fontWeight:"600"}}>
                        {emp.status}
                      </span>
                    </td>
                    <td style={{padding:"12px 14px"}}>
                      <button style={{background:"#F7F4FE", color:"#6F32B3", border:"none", borderRadius:"7px", padding:"6px 12px", fontSize:"12px", fontWeight:"600", cursor:"pointer"}}>
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Add Employee Form */}
          {showForm && (
            <div style={{position:"fixed", inset:0, background:"rgba(33,26,53,.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:50}}>
              <div style={{background:"#fff", borderRadius:"16px", padding:"28px", width:"480px", maxWidth:"95vw"}}>
                <div style={{fontWeight:"700", fontSize:"17px", color:"#1E1428", marginBottom:"20px"}}>Add New Employee</div>
                <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"14px"}}>
                  {[
                    {label:"Full Name", placeholder:"Suresh Naidu"},
                    {label:"Employee Code", placeholder:"2708"},
                    {label:"Designation", placeholder:"Senior Python Developer"},
                    {label:"Department", placeholder:"Software Engineering"},
                    {label:"Monthly Gross (₹)", placeholder:"120000"},
                    {label:"Date of Joining", placeholder:"2026-07-01"},
                    {label:"Phone", placeholder:"+91 9XXXXXXXXX"},
                    {label:"Email", placeholder:"suresh@siyantechglobal.com"},
                  ].map(field => (
                    <div key={field.label}>
                      <label style={{display:"block", fontSize:"11px", fontWeight:"600", color:"#5C5470", textTransform:"uppercase", letterSpacing:"0.04em", marginBottom:"5px"}}>{field.label}</label>
                      <input placeholder={field.placeholder}
                        style={{width:"100%", padding:"9px 11px", border:"1px solid #E2D8EE", borderRadius:"9px", fontSize:"13px"}} />
                    </div>
                  ))}
                </div>
                <div style={{display:"flex", gap:"10px", marginTop:"20px", justifyContent:"flex-end"}}>
                  <button onClick={() => setShowForm(false)}
                    style={{background:"#F7F4FE", color:"#6F32B3", border:"1px solid #E2D8EE", borderRadius:"9px", padding:"9px 18px", fontSize:"13px", fontWeight:"600", cursor:"pointer"}}>
                    Cancel
                  </button>
                  <button
                    style={{background:"linear-gradient(135deg,#6F32B3,#B770CE)", color:"#fff", border:"none", borderRadius:"9px", padding:"9px 18px", fontSize:"13px", fontWeight:"600", cursor:"pointer"}}>
                    Save Employee
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
