export default function Dashboard() {
  return (
    <div style={{minHeight:"100vh", background:"#F5F3FA", fontFamily:"sans-serif"}}>
      
      {/* Top bar */}
      <div style={{background:"#fff", borderBottom:"1px solid #E2D8EE", padding:"14px 28px", display:"flex", alignItems:"center", gap:"16px"}}>
        <div style={{width:"36px", height:"36px", borderRadius:"10px", background:"linear-gradient(135deg,#6F32B3,#B770CE)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:"800", fontSize:"18px"}}>S</div>
        <div>
          <div style={{fontWeight:"700", fontSize:"16px", color:"#1E1428"}}>SiyanTech Business OS</div>
          <div style={{fontSize:"11px", color:"#5C5470"}}>SiyanTech Global Innovations Pvt. Ltd.</div>
        </div>
        <div style={{marginLeft:"auto", fontSize:"13px", color:"#5C5470"}}>Welcome, Chakradhar</div>
      </div>

      <div style={{display:"flex"}}>

        {/* Sidebar */}
        <div style={{width:"220px", background:"#2C1463", minHeight:"calc(100vh - 65px)", padding:"20px 12px"}}>
          {[
            {icon:"◧", label:"Dashboard", href:"/dashboard", active:true},
            {icon:"⏱", label:"Attendance", href:"/attendance"},
            {icon:"✈", label:"Leaves", href:"/leaves"},
            {icon:"☰", label:"Employees", href:"/employees"},
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

        {/* Main content */}
        <div style={{flex:1, padding:"28px"}}>
          
          <h2 style={{fontFamily:"sans-serif", fontSize:"22px", fontWeight:"700", color:"#1E1428", marginBottom:"20px"}}>
            Dashboard
          </h2>

          {/* KPI cards */}
          <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:"16px", marginBottom:"28px"}}>
            {[
              {label:"Employees", value:"7", sub:"Active staff", color:"#6F32B3"},
              {label:"Present Today", value:"5 / 7", sub:"2 not yet in", color:"#0E9F6E"},
              {label:"Pending Leaves", value:"2", sub:"Awaiting approval", color:"#C77B0A"},
              {label:"Outstanding", value:"₹2.15L", sub:"3 unpaid invoices", color:"#D6455D"},
            ].map((kpi) => (
              <div key={kpi.label} style={{background:"#fff", border:"1px solid #E2D8EE", borderRadius:"14px", padding:"20px", boxShadow:"0 1px 3px rgba(44,20,99,.07)"}}>
                <div style={{fontSize:"11px", fontWeight:"600", color:"#5C5470", textTransform:"uppercase", letterSpacing:"0.04em"}}>{kpi.label}</div>
                <div style={{fontSize:"28px", fontWeight:"800", color:kpi.color, marginTop:"6px"}}>{kpi.value}</div>
                <div style={{fontSize:"12px", color:"#5C5470", marginTop:"4px"}}>{kpi.sub}</div>
              </div>
            ))}
          </div>

          {/* Two columns */}
          <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:"20px"}}>
            
            {/* Quick actions */}
            <div style={{background:"#fff", border:"1px solid #E2D8EE", borderRadius:"14px", padding:"20px"}}>
              <div style={{fontWeight:"700", fontSize:"15px", color:"#1E1428", marginBottom:"14px"}}>Quick Actions</div>
              {[
                {label:"➕ New Invoice", href:"/invoices/new", color:"#6F32B3"},
                {label:"👤 Add Employee", href:"/employees/new", color:"#6F32B3"},
                {label:"✉ Generate HR Letter", href:"/hr-letters", color:"#6F32B3"},
                {label:"▦ Run Payroll", href:"/payroll", color:"#6F32B3"},
              ].map((action) => (
                <a key={action.label} href={action.href}
                  style={{display:"block", padding:"10px 14px", marginBottom:"8px", borderRadius:"9px", background:"#F7F4FE", color:"#6F32B3", textDecoration:"none", fontSize:"13.5px", fontWeight:"500"}}>
                  {action.label}
                </a>
              ))}
            </div>

            {/* Modules status */}
            <div style={{background:"#fff", border:"1px solid #E2D8EE", borderRadius:"14px", padding:"20px"}}>
              <div style={{fontWeight:"700", fontSize:"15px", color:"#1E1428", marginBottom:"14px"}}>System Modules</div>
              {[
                {label:"Database", status:"Connected", ok:true},
                {label:"GST Engine", status:"Ready", ok:true},
                {label:"Payroll Engine", status:"Ready", ok:true},
                {label:"HR Letters", status:"Ready", ok:true},
                {label:"PDF Generation", status:"Coming soon", ok:false},
              ].map((mod) => (
                <div key={mod.label} style={{display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 0", borderBottom:"1px solid #E2D8EE"}}>
                  <span style={{fontSize:"13px", color:"#1E1428"}}>{mod.label}</span>
                  <span style={{fontSize:"11.5px", fontWeight:"600", padding:"3px 10px", borderRadius:"99px", background: mod.ok ? "#E3F6EE" : "#F4ECFA", color: mod.ok ? "#0E9F6E" : "#6F32B3"}}>
                    {mod.status}
                  </span>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
