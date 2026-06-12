import {
  Document, Page, Text, View, Image, StyleSheet, Font,
} from "@react-pdf/renderer";

Font.register({
  family: "Roboto",
  fonts: [
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf", fontWeight: 400 },
    { src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf", fontWeight: 700 },
  ],
});

const PURPLE      = "#6B30B5";
const PURPLE_DARK = "#7038BE";
const GREY        = "#5C5470";
const BLACK       = "#1A1128";
const COMPANY = {
  name:    "SiyanTech Global Innovations Pvt. Ltd.",
  address: "Flat No. S-4, Third Floor, Rednam Plaza, Dwarakanagar Second Lane, Visakhapatnam - 530016",
  phone:   "+91 9390560625 / +91 6302042599",
  email:   "Info@siyantechglobal.com",
};
const LH_URL = process.env.NEXT_PUBLIC_APP_URL
  ? `${process.env.NEXT_PUBLIC_APP_URL}/letterhead.png`
  : "https://siyantech-business-os.vercel.app/letterhead.png";
const TC_CLAUSES = [
  "This offer is subject to verification of all original educational certificates, identity proof and other relevant documents at the time of joining.",
  "During the probation period of 3 months, either party may terminate employment with 7 days written notice.",
  "You are required to maintain strict confidentiality of all company data, client information and business processes during and after employment.",
  "This offer letter is valid for 7 days from the date of issue. Kindly sign and return a copy as confirmation of acceptance.",
  "Any false declaration of information or credentials shall lead to immediate termination of employment.",
  "The employee shall comply with all company policies including the Information Security Policy (ISO/IEC 27001:2022) and Code of Conduct.",
];
type CompRow = { label: string; monthly: number; annual: number };
export interface LetterProps {
  type: string; empName: string; empCode: string; designation: string;
  department: string; dateOfJoining: string; monthlyGross: number;
  description: string; extra: Record<string, string>; compRows: CompRow[];
  signatory: string; sigTitle: string; refNumber: string; today: string;
}

const s = StyleSheet.create({
  page:     { fontFamily:"Roboto", fontSize:10, color:BLACK, backgroundColor:"#fff" },
  pageWrap: { fontFamily:"Roboto", fontSize:10, color:BLACK, backgroundColor:"#fff" },
  lhBg:     { position:"absolute", top:0, left:0, width:"100%", height:"100%" },
  content:  { paddingTop:265, paddingLeft:55, paddingRight:55, paddingBottom:160 },
  title:    { fontSize:17, fontWeight:700, color:PURPLE, textAlign:"center", borderBottomColor:PURPLE, borderBottomWidth:2, paddingBottom:5, marginBottom:12 },
  metaRow:  { flexDirection:"row", justifyContent:"space-between", fontSize:9.5, marginBottom:10 },
  bold:     { fontFamily:"Roboto", fontWeight:700 },
  para:     { marginBottom:8, lineHeight:1.7, textAlign:"justify", fontSize:10 },
  grey:     { color:GREY, fontSize:9 },
  secBand:  { backgroundColor:PURPLE_DARK, color:"#fff", fontFamily:"Roboto", fontWeight:700, fontSize:10, padding:6, paddingLeft:10, borderRadius:4, marginTop:12, marginBottom:6 },
  thRow:    { flexDirection:"row", backgroundColor:PURPLE_DARK },
  trEven:   { flexDirection:"row", backgroundColor:"#fff" },
  trOdd:    { flexDirection:"row", backgroundColor:"#F6F1FB" },
  trTotal:  { flexDirection:"row", backgroundColor:PURPLE_DARK },
  th:       { color:"#fff", fontWeight:600, fontSize:9, padding:5, paddingLeft:8, flex:1, borderRightColor:"#9B6FCC", borderRightWidth:1 },
  td:       { fontSize:9, padding:5, paddingLeft:8, flex:1, borderRightColor:"#E4DAF0", borderRightWidth:1, borderBottomColor:"#E4DAF0", borderBottomWidth:1, color:BLACK },
  tdPurple: { fontSize:9, padding:5, paddingLeft:8, flex:1, borderRightColor:"#E4DAF0", borderRightWidth:1, borderBottomColor:"#E4DAF0", borderBottomWidth:1, color:PURPLE, fontWeight:600 },
  tdWhite:  { fontSize:9, padding:5, paddingLeft:8, flex:1, borderRightColor:"#9B6FCC", borderRightWidth:1, color:"#fff" },
  tdRight:  { textAlign:"right" },
  bullet:   { flexDirection:"row", marginBottom:6, fontSize:9.5, lineHeight:1.65 },
  bulletDot:{ width:14, color:PURPLE, fontWeight:700 },
  bulletTxt:{ flex:1, textAlign:"justify" },
  sigRow:   { flexDirection:"row", justifyContent:"space-between", marginTop:30 },
  sigBlock: { fontSize:10 },
  sigLine:  { borderTopColor:"#1A1128", borderTopWidth:1.5, marginTop:32, marginBottom:4, width:180 },
  footer:   { position:"absolute", bottom:42, left:52, right:52, flexDirection:"row", justifyContent:"space-between", fontSize:8, color:BLACK },
});

function inWords(n: number): string {
  const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  const two  = (x: number): string => x<20?ones[x]:tens[Math.floor(x/10)]+(x%10?" "+ones[x%10]:"");
  const three= (x: number): string => (x>99?ones[Math.floor(x/100)]+" Hundred"+(x%100?" ":""):"")+(x%100?two(x%100):"");
  let out=""; let m=n;
  const cr=Math.floor(m/1e7);m%=1e7;const lk=Math.floor(m/1e5);m%=1e5;const th=Math.floor(m/1e3);m%=1e3;
  if(cr)out+=three(cr)+" Crore ";if(lk)out+=three(lk)+" Lakh ";if(th)out+=three(th)+" Thousand ";if(m)out+=three(m);
  return out.trim();
}

function LHPage({children}:{children:React.ReactNode}){
  return(
    <Page size="A4" style={s.page} wrap>
      {/* Letterhead image - fixed so it appears on every page without wrapping */}
      <Image src={LH_URL} style={{position:"absolute",top:0,left:0,width:"100%",height:"100%"}} fixed/>
      {/* Content */}
      <View style={s.content} wrap>{children}</View>
    </Page>
  );
}

function TRow({cells,purple=false,total=false,idx=0}:{cells:string[];purple?:boolean;total?:boolean;idx?:number}){
  const rs=total?s.trTotal:idx%2===0?s.trEven:s.trOdd;
  return(
    <View style={rs} wrap={false}>
      {cells.map((c,i)=>(<Text key={i} style={[total?s.tdWhite:purple&&i===0?s.tdPurple:s.td,i>0?s.tdRight:{}]}>{c}</Text>))}
    </View>
  );
}

function BulletList({items}:{items:string[]}){
  return(
    <View style={{marginBottom:8}}>
      {items.map((item,i)=>(
        <View key={i} style={s.bullet} wrap={false}>
          <Text style={s.bulletDot}>•</Text>
          <Text style={s.bulletTxt}>{item}</Text>
        </View>
      ))}
    </View>
  );
}

function SigBlock({signatory,sigTitle,candidateName}:{signatory:string;sigTitle:string;candidateName?:string}){
  return(
    <View style={s.sigRow} wrap={false}>
      <View style={s.sigBlock}>
        <Text>For {COMPANY.name}</Text>
        <View style={s.sigLine}/>
        <Text style={s.bold}>{signatory}</Text>
        <Text style={s.grey}>{sigTitle}</Text>
      </View>
      {candidateName!==undefined&&(
        <View style={s.sigBlock}>
          <Text>Candidate Acceptance</Text>
          <View style={{marginTop:32}}>
            <Text>Name: {candidateName||"___________________________"}</Text>
            <Text style={{marginTop:6}}>Signature: ___________________________</Text>
            <Text style={{marginTop:6}}>Date: ___________________________</Text>
          </View>
        </View>
      )}
    </View>
  );
}

function CompTable({compRows,label}:{compRows:CompRow[];label:string}){
  const totalM=compRows.reduce((s,r)=>s+(+r.monthly||0),0);
  const totalA=compRows.reduce((s,r)=>s+(+r.annual||0),0);
  return(
    <>
      <Text style={s.secBand}>{label}</Text>
      <View style={{marginBottom:10}}>
        <View style={s.thRow} wrap={false}>
          <Text style={s.th}>Salary Component</Text>
          <Text style={[s.th,s.tdRight]}>Monthly (Rs.)</Text>
          <Text style={[s.th,s.tdRight]}>Annual (Rs.)</Text>
        </View>
        {compRows.map((r,i)=>(<TRow key={i} idx={i} purple cells={[r.label,(+r.monthly||0).toLocaleString("en-IN"),(+r.annual||0).toLocaleString("en-IN")]}/>))}
        <TRow total cells={["Cost to Company (CTC)",totalM.toLocaleString("en-IN"),totalA.toLocaleString("en-IN")]}/>
      </View>
    </>
  );
}

export function LetterPDF(props: LetterProps){
  const{type,empName,empCode,designation,department,dateOfJoining,monthlyGross,description,extra,compRows,signatory,sigTitle,refNumber,today}=props;
  const rows=compRows||[];
  const annual=monthlyGross*12;
  const ctc=+(extra?.ctc||annual);
  const candidateN=extra?.candidateName||"";
  const role=extra?.role||designation||"";
  const dept=extra?.dept||department||"";
  const empType=extra?.empType||"Full Time";
  const joiningDate=extra?.joiningDate||"To be confirmed at time of joining";
  const reportingTo=extra?.reportingTo||"HR Manager / Managing Director";
  const lastDay=extra?.lastDay||today;
  const desc=description||"";

  if(type==="offer") return(
    <Document>
      <LHPage>
        <Text style={s.title}>OFFER LETTER</Text>
        <View style={s.metaRow}><Text><Text style={s.bold}>Date: </Text>{today}</Text><Text><Text style={s.bold}>Ref No: </Text>{refNumber}</Text></View>
        <Text style={{marginBottom:8}}>To,{"\n"}<Text style={s.bold}>{candidateN||"[Candidate Name]"}</Text>{"\n"}{extra?.address||"Visakhapatnam, Andhra Pradesh"}</Text>
        <Text style={{marginBottom:8,fontWeight:600}}>Subject: Letter of Offer - {role} | CTC: Rs {ctc.toLocaleString("en-IN")} Per Annum</Text>
        <View style={{borderBottomColor:"#ccc",borderBottomWidth:1,marginBottom:8}}/>
        <Text style={{marginBottom:6}}>Dear {(candidateN||"Candidate").split(" ")[0]},</Text>
        <Text style={s.para}>{desc||"We are delighted to offer you the position of "+role+" at "+COMPANY.name+", Visakhapatnam. This offer follows your successful performance during the selection process."}</Text>
        <Text style={s.secBand}>1. TERMS OF EMPLOYMENT</Text>
        <View style={{marginBottom:10}}>
          <View style={s.thRow} wrap={false}><Text style={s.th}>Parameter</Text><Text style={s.th}>Details</Text></View>
          {[["Designation",role],["Department",dept],["Employment Type",empType],["Date of Joining",joiningDate],["Work Location","Visakhapatnam, Andhra Pradesh (On-site)"],["Reporting To",reportingTo],["Probation Period","3 Months from Date of Joining"],["Working Hours","9:00 AM - 6:00 PM | Monday to Friday"],["Notice Period","30 Days (post-probation)"]].map(([k,v],i)=>(<TRow key={i} cells={[k,v]} purple idx={i}/>))}
        </View>
        <CompTable compRows={rows} label="2. COMPENSATION DETAILS"/>
        <Text style={{fontSize:9,color:GREY,marginBottom:8}}>CTC in words: Rupees {inWords(ctc)} Only.</Text>
        <Text style={s.secBand}>3. TERMS AND CONDITIONS</Text>
        <BulletList items={TC_CLAUSES}/>
        <Text style={{marginBottom:8,marginTop:8,fontSize:10}}>We welcome you to the SiyanTech family and look forward to a long and productive association.</Text>
        <SigBlock signatory={signatory} sigTitle={sigTitle} candidateName={candidateN}/>
      </LHPage>
    </Document>
  );

  if(type==="experience") return(
    <Document>
      <LHPage>
        <Text style={s.title}>EXPERIENCE CERTIFICATE</Text>
        <View style={s.metaRow}><Text><Text style={s.bold}>Date: </Text>{today}</Text><Text><Text style={s.bold}>Ref No: </Text>{refNumber}</Text></View>
        <Text style={{fontWeight:700,marginBottom:10}}>To Whomsoever It May Concern</Text>
        <Text style={s.para}>{desc||"This is to certify that "+empName+" (Employee Code: "+empCode+") was employed with "+COMPANY.name+", Visakhapatnam, as "+designation+" in the "+department+" department."}</Text>
        <Text style={s.para}>They joined our organization on {dateOfJoining} and served until {lastDay}. During this period, they demonstrated strong commitment and professionalism.</Text>
        <Text style={s.para}>We wish {empName.split(" ")[0]} the very best in all future career endeavours.</Text>
        <Text style={s.secBand}>Employment Details</Text>
        <View style={{marginBottom:14}}>
          <View style={s.thRow} wrap={false}><Text style={s.th}>Field</Text><Text style={s.th}>Details</Text><Text style={s.th}>Field</Text><Text style={s.th}>Details</Text></View>
          {[["Employee Name",empName,"Employee Code",empCode],["Designation",designation,"Department",department],["Date of Joining",dateOfJoining,"Last Working Day",lastDay]].map(([k1,v1,k2,v2],i)=>(
            <View key={i} style={i%2===0?s.trEven:s.trOdd} wrap={false}>
              <Text style={s.tdPurple}>{k1}</Text><Text style={s.td}>{v1}</Text><Text style={s.tdPurple}>{k2}</Text><Text style={s.td}>{v2}</Text>
            </View>
          ))}
        </View>
        <SigBlock signatory={signatory} sigTitle={sigTitle}/>
      </LHPage>
    </Document>
  );

  if(type==="relieving") return(
    <Document>
      <LHPage>
        <Text style={s.title}>RELIEVING LETTER</Text>
        <View style={s.metaRow}><Text><Text style={s.bold}>Date: </Text>{today}</Text><Text><Text style={s.bold}>Ref No: </Text>{refNumber}</Text></View>
        <Text style={{marginBottom:8}}>To,{"\n"}<Text style={s.bold}>{empName}</Text>{"\n"}{designation}</Text>
        <Text style={{marginBottom:6}}>Dear {empName.split(" ")[0]},</Text>
        <Text style={s.para}>{desc||"This is with reference to your resignation from the position of "+designation+" at "+COMPANY.name+"."}</Text>
        <Text style={s.para}>We confirm that your resignation has been accepted and you stand relieved with effect from {lastDay}.</Text>
        <Text style={s.para}>We confirm there are no dues pending against you. Your full and final settlement will be processed as per company policy.</Text>
        <Text style={s.secBand}>Employment Summary</Text>
        <View style={{marginBottom:14}}>
          <View style={s.thRow} wrap={false}><Text style={s.th}>Field</Text><Text style={s.th}>Details</Text><Text style={s.th}>Field</Text><Text style={s.th}>Details</Text></View>
          {[["Employee Name",empName,"Designation",designation],["Date of Joining",dateOfJoining,"Last Working Day",lastDay],["Department",department,"Status","Relieved - No Dues Pending"]].map(([k1,v1,k2,v2],i)=>(
            <View key={i} style={i%2===0?s.trEven:s.trOdd} wrap={false}>
              <Text style={s.tdPurple}>{k1}</Text><Text style={s.td}>{v1}</Text><Text style={s.tdPurple}>{k2}</Text><Text style={s.td}>{v2}</Text>
            </View>
          ))}
        </View>
        <SigBlock signatory={signatory} sigTitle={sigTitle}/>
      </LHPage>
    </Document>
  );

  if(type==="salary") return(
    <Document>
      <LHPage>
        <Text style={s.title}>SALARY CERTIFICATE</Text>
        <View style={s.metaRow}><Text><Text style={s.bold}>Date: </Text>{today}</Text><Text><Text style={s.bold}>Ref No: </Text>{refNumber}</Text></View>
        <Text style={{fontWeight:700,marginBottom:10}}>To Whomsoever It May Concern</Text>
        <Text style={s.para}>{desc||"This is to certify that "+empName+" (Employee Code: "+empCode+") is a permanent employee of "+COMPANY.name+", working as "+designation+" since "+dateOfJoining+"."}</Text>
        <Text style={s.para}>Monthly gross salary: Rs {monthlyGross.toLocaleString("en-IN")}/- (Rupees {inWords(monthlyGross)} Only). Annual gross: Rs {annual.toLocaleString("en-IN")}/-, subject to statutory deductions.</Text>
        <Text style={s.para}>This certificate is issued for bank / loan / visa purposes, without any liability on the part of the company.</Text>
        <Text style={s.secBand}>Employee Details</Text>
        <View style={{marginBottom:14}}>
          <View style={s.thRow} wrap={false}><Text style={s.th}>Field</Text><Text style={s.th}>Details</Text><Text style={s.th}>Field</Text><Text style={s.th}>Details</Text></View>
          {[["Name",empName,"Employee Code",empCode],["Designation",designation,"Department",department],["Date of Joining",dateOfJoining,"Monthly Gross","Rs "+monthlyGross.toLocaleString("en-IN")]].map(([k1,v1,k2,v2],i)=>(
            <View key={i} style={i%2===0?s.trEven:s.trOdd} wrap={false}>
              <Text style={s.tdPurple}>{k1}</Text><Text style={s.td}>{v1}</Text><Text style={s.tdPurple}>{k2}</Text><Text style={s.td}>{v2}</Text>
            </View>
          ))}
        </View>
        <SigBlock signatory={signatory} sigTitle={sigTitle}/>
      </LHPage>
    </Document>
  );

  return(
    <Document>
      <LHPage>
        <Text style={s.title}>APPOINTMENT LETTER</Text>
        <View style={s.metaRow}><Text><Text style={s.bold}>Date: </Text>{today}</Text><Text><Text style={s.bold}>Ref No: </Text>{refNumber}</Text></View>
        <Text style={{marginBottom:8}}>To,{"\n"}<Text style={s.bold}>{empName}</Text>{"\n"}{designation}</Text>
        <Text style={{marginBottom:6}}>Dear {empName.split(" ")[0]},</Text>
        <Text style={s.para}>{desc||"With reference to your acceptance of our offer, we are pleased to appoint you as "+designation+" at "+COMPANY.name+"."}</Text>
        <Text style={s.para}>Your monthly gross salary will be Rs {monthlyGross.toLocaleString("en-IN")}/- (Rupees {inWords(monthlyGross)} Only), subject to statutory deductions.</Text>
        <CompTable compRows={rows} label="COMPENSATION DETAILS"/>
        <SigBlock signatory={signatory} sigTitle={sigTitle}/>
      </LHPage>
    </Document>
  );
}
