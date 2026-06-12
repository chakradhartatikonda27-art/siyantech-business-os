"use client";
import { useState } from "react";

const CLIENTS = [
  {id:"1", name:"Sripuji Makeovers", city:"Visakhapatnam", state:"Andhra Pradesh", stateCode:"37", gstin:"37AAACS1234F1Z2"},
  {id:"2", name:"Square Feet India", city:"Hyderabad", state:"Telangana", stateCode:"36", gstin:"36AABCS5678K1Z7"},
  {id:"3", name:"Parishram Resources", city:"Gurugram", state:"Haryana", stateCode:"06", gstin:"06AAFCP4083L1Z4"},
  {id:"4", name:"Siyantra AI Solutions", city:"Bengaluru", state:"Karnataka", stateCode:"29", gstin:"29AAHCS3456M1Z1"},
];

const INVOICES = [
  {no:"SGI/0002/26-27", client:"Parishram Resources", date:"04-Jun-2026", grand:160518, paid:160518, status:"PAID", type:"INTER"},
  {no:"SGI/0001/26-27", client:"Square Feet India", date:"01-May-2026", grand:283200, paid:283200, status:"PAID", type:"INTER"},
];

const inr = (n: number) => "₹" + Math.round(n).toLocaleString("en-IN");

function computeGST(items: {qty:number,rate:number}[], stateCode:string, scPct:number, gstRate:number) {
  const subtotal = items.reduce((s,it) => s + it.qty * it.rate, 0);
  const sc = subtotal * scPct / 100;
  const taxable = subtotal + sc;
  const intra = stateCode === "37";
  const cgst = intra ? taxable * gstRate/2/100 : 0;
  const sgst = intra ? taxable * gstRate/2/100 : 0;
  const igst = intra ? 0 : taxable * gstRate/100;
  const raw = taxable + cgst + sgst + igst;
  const grand = Math.round(raw);
  return {subtotal, sc, taxable, cgst, sgst, igst, grand, intra};
}

export default function InvoicesPage() {
  const [showNew, setShowNew] = useState(false);
  const [clientId, setClientId] = useState("1");
  const [scPct, setScPct] = useState(0);
  const [gstRate, setGstRate] = useState(18);
  const [items, setItems] = useState([{desc:"", qty:1, rate:0}]);

  const client = CLIENTS.find(c => c.id === clientId)!;
  const totals = computeGST(items, client.stateCode, scPct, gstRate);

  const addItem = () => setItems([...items, {desc:"", qty:1, rate:0}]);
  const updateItem = (i:number, field:string, val:string) => {
    const updated = [...items];
    (updated[i] as never)[field] = field === "desc" ? val : +val;
    setItems(updated);
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
            {icon:"✈", label:"Leaves", href:"/leaves"},
            {icon:"☰", label:"Employees", href:"/employees"},
            {icon:"✉", label:"HR Letters", href:"/hr-letters"},
            {icon:"◈", label:"Leads", href:"/leads"},
            {icon:"₹", label:"Invoices", href:"/invoices", active:true},
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
              <h2 style={{fontSize:"22px", fontWeight:"700", color:"#1E1428"}}>Invoices</h2>
              <p style={{fontSize:"13px", color:"#5C5470", marginTop:"2px"}}>Tax invoices with auto GST calculation</p>
            </div>
            <button onClick={() => setShowNew(true)}
              style={{background:"linear-gradient(135deg,#6F32B3,#B770CE)", color:"#fff", border:"none", borderRadius:"10px", padding:"10px 20px", fontSize:"14px", fontWeight:"600", cursor:"pointer"}}>
              + New Invoice
            </button>
          </div>

          {/* Invoice list */}
          <div style={{background:"#fff", border:"1px solid #E2D8EE", borderRadius:"14px", overflow:"hidden"}}>
            <table style={{width:"100%", borderCollapse:"collapse", fontSize:"13.5px"}}>
              <thead>
                <tr style={{background:"#7B3CC4"}}>
                  {["Invoice No","Client","Date","Amount","GST Type","Status",""].map(h => (
                    <th key={h} style={{padding:"11px 14px", textAlign:"left", color:"#fff", fontSize:"11px", fontWeight:"600", letterSpacing:"0.07em", textTransform:"uppercase"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {INVOICES.map((inv, i) => (
                  <tr key={inv.no} style={{borderBottom:"1px solid #E2D8EE", background:i%2===0?"#fff":"#F8F2FB"}}>
                    <td style={{padding:"12px 14px", fontFamily:"monospace", fontSize:"12px", fontWeight:"600"}}>{inv.no}</td>
                    <td style={{padding:"12px 14px", fontWeight:"600", color:"#1E1428"}}>{inv.client}</td>
                    <td style={{padding:"12px 14px", color:"#5C5470"}}>{inv.date}</td>
                    <td style={{padding:"12px 14px", fontWeight:"700", color:"#6F32B3"}}>{inr(inv.grand)}</td>
                    <td style={{padding:"12px 14px"}}>
                      <span style={{background:inv.type==="INTRA"?"#E3F6EE":"#FCF0DC", color:inv.type==="INTRA"?"#0E9F6E":"#C77B0A", padding:"3px 10px", borderRadius:"99px", fontSize:"11.5px", fontWeight:"600"}}>
                        {inv.type==="INTRA"?"CGST+SGST":"IGST"}
                      </span>
                    </td>
                    <td style={{padding:"12px 14px"}}>
                      <span style={{background:"#E3F6EE", color:"#0E9F6E", padding:"3px 10px", borderRadius:"99px", fontSize:"11.5px", fontWeight:"600"}}>
                        {inv.status}
                      </span>
                    </td>
                    <td style={{padding:"12px 14px"}}>
                      <button style={{background:"#F7F4FE", color:"#6F32B3", border:"none", borderRadius:"7px", padding:"6px 12px", fontSize:"12px", fontWeight:"600", cursor:"pointer"}}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* New Invoice form */}
          {showNew && (
            <div style={{position:"fixed", inset:0, background:"rgba(33,26,53,.5)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:50, padding:"20px"}}>
              <div style={{background:"#fff", borderRadius:"16px", padding:"28px", width:"700px", maxWidth:"95vw", maxHeight:"90vh", overflowY:"auto"}}>
                <div style={{fontWeight:"700", fontSize:"17px", color:"#1E1428", marginBottom:"20px"}}>New Tax Invoice</div>

                <div style={{display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"14px", marginBottom:"20px"}}>
                  <div>
                    <label style={{display:"block", fontSize:"11px", fontWeight:"600", color:"#5C5470", textTransform:"uppercase", marginBottom:"5px"}}>Client</label>
                    <select value={clientId} onChange={e => setClientId(e.target.value)}
                      style={{width:"100%", padding:"9px 11px", border:"1px solid #E2D8EE", borderRadius:"9px", fontSize:"13px"}}>
                      {CLIENTS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{display:"block", fontSize:"11px", fontWeight:"600", color:"#5C5470", textTransform:"uppercase", marginBottom:"5px"}}>Service Charge %</label>
                    <input type="number" value={scPct} onChange={e => setScPct(+e.target.value)}
                      style={{width:"100%", padding:"9px 11px", border:"1px solid #E2D8EE", borderRadius:"9px", fontSize:"13px"}} />
                  </div>
                  <div>
                    <label style={{display:"block", fontSize:"11px", fontWeight:"600", color:"#5C5470", textTransform:"uppercase", marginBottom:"5px"}}>GST Rate %</label>
                    <select value={gstRate} onChange={e => setGstRate(+e.target.value)}
                      style={{width:"100%", padding:"9px 11px", border:"1px solid #E2D8EE", borderRadius:"9px", fontSize:"13px"}}>
                      <option value={18}>18%</option>
                      <option value={12}>12%</option>
                      <option value={5}>5%</option>
                    </select>
                  </div>
                </div>

                {/* GST flag */}
                <div style={{padding:"8px 12px", borderRadius:"8px", marginBottom:"16px", background:totals.intra?"#E3F6EE":"#FCF0DC", color:totals.intra?"#0E9F6E":"#C77B0A", fontSize:"12.5px", fontWeight:"600"}}>
                  {client.state} → {totals.intra ? `Intra-state · CGST ${gstRate/2}% + SGST ${gstRate/2}% (auto)` : `Inter-state · IGST ${gstRate}% (auto)`}
                </div>

                {/* Line items */}
                <div style={{fontSize:"11px", fontWeight:"600", color:"#5C5470", textTransform:"uppercase", marginBottom:"8px"}}>Line Items</div>
                {items.map((it, i) => (
                  <div key={i} style={{display:"grid", gridTemplateColumns:"2.5fr 0.7fr 1fr 1fr", gap:"8px", marginBottom:"8px", alignItems:"center"}}>
                    <input placeholder="Description of service" value={it.desc} onChange={e => updateItem(i,"desc",e.target.value)}
                      style={{padding:"8px 10px", border:"1px solid #E2D8EE", borderRadius:"8px", fontSize:"13px"}} />
                    <input type="number" value={it.qty} onChange={e => updateItem(i,"qty",e.target.value)}
                      style={{padding:"8px 10px", border:"1px solid #E2D8EE", borderRadius:"8px", fontSize:"13px"}} />
                    <input type="number" placeholder="Rate ₹" value={it.rate||""} onChange={e => updateItem(i,"rate",e.target.value)}
                      style={{padding:"8px 10px", border:"1px solid #E2D8EE", borderRadius:"8px", fontSize:"13px"}} />
                    <div style={{textAlign:"right", fontWeight:"600", color:"#6F32B3"}}>{inr(it.qty*it.rate)}</div>
                  </div>
                ))}
                <button onClick={addItem}
                  style={{background:"#F7F4FE", color:"#6F32B3", border:"1px solid #E2D8EE", borderRadius:"8px", padding:"7px 14px", fontSize:"12.5px", fontWeight:"600", cursor:"pointer", marginBottom:"16px"}}>
                  + Add line item
                </button>

                {/* Totals */}
                <div style={{background:"#F7F4FE", border:"1px solid #E2D8EE", borderRadius:"11px", padding:"16px", marginBottom:"16px"}}>
                  {[
                    ["Subtotal", inr(totals.subtotal)],
                    scPct>0 ? [`Service Charge @ ${scPct}%`, inr(totals.sc)] : null,
                    scPct>0 ? ["Total Taxable", inr(totals.taxable)] : null,
                    totals.intra ? [`CGST @ ${gstRate/2}%`, inr(totals.cgst)] : null,
                    totals.intra ? [`SGST @ ${gstRate/2}%`, inr(totals.sgst)] : null,
                    !totals.intra ? [`IGST @ ${gstRate}%`, inr(totals.igst)] : null,
                  ].filter(Boolean).map(row => (
                    <div key={row![0]} style={{display:"flex", justifyContent:"space-between", padding:"4px 0", fontSize:"13px"}}>
                      <span style={{color:"#5C5470"}}>{row![0]}</span><span>{row![1]}</span>
                    </div>
                  ))}
                  <div style={{display:"flex", justifyContent:"space-between", background:"#2A1845", color:"#fff", borderRadius:"8px", padding:"10px 14px", marginTop:"8px", fontWeight:"700", fontSize:"15px"}}>
                    <span>Grand Total</span><span>{inr(totals.grand)}</span>
                  </div>
                </div>

                <div style={{display:"flex", gap:"10px", justifyContent:"flex-end"}}>
                  <button onClick={() => setShowNew(false)}
                    style={{background:"#F7F4FE", color:"#6F32B3", border:"1px solid #E2D8EE", borderRadius:"9px", padding:"9px 18px", fontSize:"13px", fontWeight:"600", cursor:"pointer"}}>
                    Cancel
                  </button>
                  <button
                    style={{background:"linear-gradient(135deg,#6F32B3,#B770CE)", color:"#fff", border:"none", borderRadius:"9px", padding:"9px 18px", fontSize:"13px", fontWeight:"600", cursor:"pointer"}}>
                    Save Invoice
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
