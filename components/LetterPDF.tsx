"use client";
import {
  Document, Page, Text, View, Image, StyleSheet, Font
} from "@react-pdf/renderer";

Font.register({
  family: "Poppins",
  fonts: [
    { src: "https://fonts.gstatic.com/s/poppins/v20/pxiEyp8kv8JHgFVrJJfecg.woff2", fontWeight: 400 },
    { src: "https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLGT9Z1xlFQ.woff2", fontWeight: 600 },
    { src: "https://fonts.gstatic.com/s/poppins/v20/pxiByp8kv8JHgFVrLCz7Z1xlFQ.woff2", fontWeight: 700 },
  ],
});

const COMPANY = {
  name: "SiyanTech Global Innovations Pvt. Ltd.",
  address: "Flat No. S-4, Third Floor, Rednam Plaza, Dwarakanagar Second Lane, Visakhapatnam - 530016",
  gstin: "37ABHCS2274B2ZF",
  cin: "U72900AP2021PTC119926",
  phone: "+91 9390560625 / +91 6302042599",
  email: "Info@siyantechglobal.com",
  iso: "ISO 9001:2015 | ISO/IEC 27001:2022",
};

const PURPLE = "#6B30B5";
const PURPLE_DARK = "#7038BE";
const GREY = "#5C5470";
const BLACK = "#1A1128";

const s = StyleSheet.create({
  page: { fontFamily: "Poppins", fontSize: 10, color: BLACK, backgroundColor: "#fff" },
  lhBg: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%" },
  content: { margin: "180 55 120 55" },
  title: { fontSize: 18, fontWeight: 700, color: PURPLE, textAlign: "center", borderBottom: `2 solid ${PURPLE}`, paddingBottom: 5, marginBottom: 12 },
  metaRow: { flexDirection: "row", justifyContent: "space-between", fontSize: 10, marginBottom: 10 },
  bold: { fontWeight: 700 },
  para: { marginBottom: 8, lineHeight: 1.7, textAlign: "justify" },
  secBand: { backgroundColor: PURPLE_DARK, color: "#fff", fontWeight: 600, fontSize: 10, padding: "6 10", borderRadius: 4, marginTop: 12, marginBottom: 6 },
  table: { marginBottom: 10 },
  thRow: { flexDirection: "row", backgroundColor: PURPLE_DARK },
  th: { color: "#fff", fontWeight: 600, fontSize: 9, padding: "5 8", flex: 1, borderRight: "1 solid #9B6FCC" },
  trEven: { flexDirection: "row", backgroundColor: "#fff" },
  trOdd: { flexDirection: "row", backgroundColor: "#F6F1FB" },
  trTotal: { flexDirection: "row", backgroundColor: PURPLE_DARK },
  td: { fontSize: 9, padding: "5 8", flex: 1, borderRight: "1 solid #E4DAF0", borderBottom: "1 solid #E4DAF0", color: BLACK },
  tdPurple: { fontSize: 9, padding: "5 8", flex: 1, borderRight: "1 solid #E4DAF0", borderBottom: "1 solid #E4DAF0", color: PURPLE, fontWeight: 600 },
  tdWhite: { fontSize: 9, padding: "5 8", flex: 1, borderRight: "1 solid #9B6FCC", color: "#fff" },
  tdRight: { textAlign: "right" },
  sigRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 28 },
  sigBlock: { fontSize: 10 },
  sigLine: { borderTop: "1.5 solid #1A1128", marginTop: 30, marginBottom: 4, width: 180 },
  footer: { position: "absolute", bottom: 45, left: 55, right: 55, flexDirection: "row", justifyContent: "space-between", fontSize: 8, color: BLACK },
  olItem: { flexDirection: "row", marginBottom: 5, fontSize: 9.5, lineHeight: 1.6 },
  olNum: { width: 16, fontWeight: 600, color: PURPLE },
  olText: { flex: 1, textAlign: "justify" },
});

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

type CompRow = { label: string; monthly: number; annual: number };

interface LetterProps {
  type: string;
  empName: string;
  empCode: string;
  designation: string;
  department: string;
  dateOfJoining: string;
  monthlyGross: number;
  description: string;
  extra: Record<string, string>;
  compRows: CompRow[];
  signatory: string;
  sigTitle: string;
  refNumber: string;
  today: string;
}

function LHPage({ children }: { children: React.ReactNode }) {
  return (
    <Page size="A4" style={s.page}>
      <Image src="/letterhead.png" style={s.lhBg} />
      <View style={s.content}>{children}</View>
      <View style={s.footer}>
        <View>
          <Text style={{ fontWeight: 600 }}>{COMPANY.phone}</Text>
          <Text>{COMPANY.email}</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text>{COMPANY.address}</Text>
        </View>
      </View>
    </Page>
  );
}

function TableRow({ cells, purple = false, total = false, idx = 0 }: {
  cells: string[]; purple?: boolean; total?: boolean; idx?: number;
}) {
  const rowStyle = total ? s.trTotal : idx % 2 === 0 ? s.trEven : s.trOdd;
  return (
    <View style={rowStyle}>
      {cells.map((c, i) => (
        <Text key={i} style={[
          total ? s.tdWhite : purple && i === 0 ? s.tdPurple : s.td,
          i > 0 ? s.tdRight : {},
        ]}>{c}</Text>
      ))}
    </View>
  );
}

function SigBlock({ signatory, sigTitle, candidateName }: {
  signatory: string; sigTitle: string; candidateName?: string;
}) {
  return (
    <View style={s.sigRow}>
      <View style={s.sigBlock}>
        <Text>For {COMPANY.name}</Text>
        <View style={s.sigLine} />
        <Text style={s.bold}>{signatory}</Text>
        <Text style={{ color: GREY, fontSize: 9 }}>{sigTitle}</Text>
        <Text style={{ color: GREY, fontSize: 9 }}>{COMPANY.name}</Text>
      </View>
      {candidateName !== undefined && (
        <View style={s.sigBlock}>
          <Text>Candidate Acceptance</Text>
          <View style={{ marginTop: 30 }}>
            <Text>Name: {candidateName || "___________________________"}</Text>
            <Text style={{ marginTop: 6 }}>Signature: ___________________________</Text>
            <Text style={{ marginTop: 6 }}>Date: ___________________________</Text>
          </View>
        </View>
      )}
    </View>
  );
}

export function LetterPDF(props: LetterProps) {
  const { type, empName, empCode, designation, department, dateOfJoining,
    monthlyGross, description, extra, compRows, signatory, sigTitle, refNumber, today } = props;
  const annual = monthlyGross * 12;
  const ctc = +(extra.ctc || annual);
  const totalMonthly = compRows.reduce((s, r) => s + r.monthly, 0);
  const totalAnnual  = compRows.reduce((s, r) => s + r.annual, 0);

  const TC_CLAUSES = [
    "This offer is subject to verification of all original educational certificates, identity proof and other relevant documents at the time of joining.",
    "During the probation period of 3 months, either party may terminate employment with 7 days' written notice.",
    "You are required to maintain strict confidentiality of all company data, client information and business processes during and after employment.",
    "This offer letter is valid for 7 days from the date of issue. Kindly sign and return a copy as confirmation of acceptance.",
    "Any false declaration of information or credentials shall lead to immediate termination of employment.",
    "The employee shall comply with all company policies including the Information Security Policy (ISO/IEC 27001:2022) and Code of Conduct.",
  ];

  if (type === "offer") {
    return (
      <Document>
        <LHPage>
          <Text style={s.title}>OFFER LETTER</Text>
          <View style={s.metaRow}>
            <Text><Text style={s.bold}>Date: </Text>{today}</Text>
            <Text><Text style={s.bold}>Ref No: </Text>{refNumber}</Text>
          </View>
          <Text style={{ marginBottom: 8 }}>To,{"\n"}<Text style={s.bold}>{extra.candidateName || "[Candidate Name]"}</Text>{"\n"}{extra.address || "Visakhapatnam, Andhra Pradesh"}</Text>
          <Text style={{ marginBottom: 8, fontWeight: 600 }}>Subject: Letter of Offer — {extra.role || designation} | CTC: ₹ {ctc.toLocaleString("en-IN")} Per Annum</Text>
          <View style={{ borderBottom: "1 solid #ccc", marginBottom: 8 }} />
          <Text style={{ marginBottom: 6 }}>Dear {(extra.candidateName || "Candidate").split(" ")[0]},</Text>
          <Text style={s.para}>{description || `We are delighted to offer you the position of ${extra.role || designation} at ${COMPANY.name}, Visakhapatnam. This offer follows your successful performance during the selection process and reflects our confidence in your potential to contribute to our growing team.`}</Text>

          <Text style={s.secBand}>1. TERMS OF EMPLOYMENT</Text>
          <View style={s.table}>
            <View style={s.thRow}><Text style={s.th}>Parameter</Text><Text style={s.th}>Details</Text></View>
            {[
              ["Designation", extra.role || designation],
              ["Department", extra.dept || department],
              ["Employment Type", extra.empType || "Full Time"],
              ["Date of Joining", extra.joiningDate || "To be confirmed at time of joining"],
              ["Work Location", "Visakhapatnam, Andhra Pradesh (On-site)"],
              ["Reporting To", extra.reportingTo || "HR Manager / Managing Director"],
              ["Probation Period", "3 Months from Date of Joining"],
              ["Working Hours", "9:00 AM – 6:00 PM | Monday to Friday"],
              ["Notice Period", "30 Days (post-probation)"],
            ].map(([k, v], i) => <TableRow key={i} cells={[k, v]} purple idx={i} />)}
          </View>

          <Text style={s.secBand}>2. COMPENSATION DETAILS</Text>
          <View style={s.table}>
            <View style={s.thRow}>
              <Text style={s.th}>Salary Component</Text>
              <Text style={[s.th, s.tdRight]}>Monthly (₹)</Text>
              <Text style={[s.th, s.tdRight]}>Annual (₹)</Text>
            </View>
            {compRows.map((r, i) => <TableRow key={i} cells={[r.label, r.monthly.toLocaleString("en-IN"), r.annual.toLocaleString("en-IN")]} purple idx={i} />)}
            <TableRow cells={["Cost to Company (CTC)", totalMonthly.toLocaleString("en-IN"), totalAnnual.toLocaleString("en-IN")]} total />
          </View>
          <Text style={{ fontSize: 9, color: GREY, marginBottom: 8 }}>CTC in words: Rupees {inWords(ctc)} Only.</Text>
        </LHPage>

        {/* Page 2 — T&C + Signature */}
        <LHPage>
          <Text style={s.secBand}>3. TERMS & CONDITIONS</Text>
          {TC_CLAUSES.map((c, i) => (
            <View key={i} style={s.olItem}>
              <Text style={s.olNum}>{i + 1}.</Text>
              <Text style={s.olText}>{c}</Text>
            </View>
          ))}
          <Text style={{ ...s.para, marginTop: 12 }}>We welcome you to the SiyanTech family and look forward to a long and productive association. Please feel free to reach out to our HR team for any queries.</Text>
          <SigBlock signatory={signatory} sigTitle={sigTitle} candidateName={extra.candidateName} />
        </LHPage>
      </Document>
    );
  }

  if (type === "experience") {
    return (
      <Document>
        <LHPage>
          <Text style={s.title}>EXPERIENCE CERTIFICATE</Text>
          <View style={s.metaRow}><Text><Text style={s.bold}>Date: </Text>{today}</Text><Text><Text style={s.bold}>Ref No: </Text>{refNumber}</Text></View>
          <Text style={{ fontWeight: 700, marginBottom: 10 }}>To Whomsoever It May Concern</Text>
          <Text style={s.para}>{description || `This is to certify that ${empName} (Employee Code: ${empCode}) was employed with ${COMPANY.name}, Visakhapatnam, as ${designation} in the ${department} department.`}</Text>
          <Text style={s.para}>They joined our organization on {dateOfJoining} and served until {extra.lastDay || today}. During this period, they demonstrated strong commitment, professionalism and a positive attitude towards their responsibilities.</Text>
          <Text style={s.para}>We wish {empName.split(" ")[0]} the very best in all future career endeavours. This certificate is issued at the request of the employee for whatsoever purpose it may serve.</Text>
          <Text style={s.secBand}>Employment Details</Text>
          <View style={s.table}>
            <View style={s.thRow}><Text style={s.th}>Field</Text><Text style={s.th}>Details</Text><Text style={s.th}>Field</Text><Text style={s.th}>Details</Text></View>
            {[["Employee Name",empName,"Employee Code",empCode],["Designation",designation,"Department",department],["Date of Joining",dateOfJoining,"Last Working Day",extra.lastDay||today]].map(([k1,v1,k2,v2],i)=>(
              <View key={i} style={i%2===0?s.trEven:s.trOdd}>
                <Text style={s.tdPurple}>{k1}</Text><Text style={s.td}>{v1}</Text>
                <Text style={s.tdPurple}>{k2}</Text><Text style={s.td}>{v2}</Text>
              </View>
            ))}
          </View>
          <SigBlock signatory={signatory} sigTitle={sigTitle} />
        </LHPage>
      </Document>
    );
  }

  if (type === "relieving") {
    return (
      <Document>
        <LHPage>
          <Text style={s.title}>RELIEVING LETTER</Text>
          <View style={s.metaRow}><Text><Text style={s.bold}>Date: </Text>{today}</Text><Text><Text style={s.bold}>Ref No: </Text>{refNumber}</Text></View>
          <Text style={{ marginBottom: 8 }}>To,{"\n"}<Text style={s.bold}>{empName}</Text>{"\n"}{designation}</Text>
          <Text style={{ marginBottom: 6 }}>Dear {empName.split(" ")[0]},</Text>
          <Text style={s.para}>{description || `This is with reference to your resignation from the position of ${designation} at ${COMPANY.name}.`}</Text>
          <Text style={s.para}>We confirm that your resignation has been accepted and you stand relieved from the services of the company with effect from the close of business hours on {extra.lastDay || today}.</Text>
          <Text style={s.para}>We further confirm that you have completed the handover of all company assets, documents and responsibilities, and that there are no dues pending against you. Your full and final settlement will be processed as per company policy.</Text>
          <Text style={s.secBand}>Employment Summary</Text>
          <View style={s.table}>
            <View style={s.thRow}><Text style={s.th}>Field</Text><Text style={s.th}>Details</Text><Text style={s.th}>Field</Text><Text style={s.th}>Details</Text></View>
            {[["Employee Name",empName,"Designation",designation],["Date of Joining",dateOfJoining,"Last Working Day",extra.lastDay||today],["Department",department,"Status","Relieved — No Dues Pending"]].map(([k1,v1,k2,v2],i)=>(
              <View key={i} style={i%2===0?s.trEven:s.trOdd}>
                <Text style={s.tdPurple}>{k1}</Text><Text style={s.td}>{v1}</Text>
                <Text style={s.tdPurple}>{k2}</Text><Text style={s.td}>{v2}</Text>
              </View>
            ))}
          </View>
          <SigBlock signatory={signatory} sigTitle={sigTitle} />
        </LHPage>
      </Document>
    );
  }

  if (type === "salary") {
    return (
      <Document>
        <LHPage>
          <Text style={s.title}>SALARY CERTIFICATE</Text>
          <View style={s.metaRow}><Text><Text style={s.bold}>Date: </Text>{today}</Text><Text><Text style={s.bold}>Ref No: </Text>{refNumber}</Text></View>
          <Text style={{ fontWeight: 700, marginBottom: 10 }}>To Whomsoever It May Concern</Text>
          <Text style={s.para}>{description || `This is to certify that ${empName} (Employee Code: ${empCode}) is a permanent employee of ${COMPANY.name}, working as ${designation} since ${dateOfJoining}.`}</Text>
          <Text style={s.para}>The current monthly gross salary of the employee is ₹ {monthlyGross.toLocaleString("en-IN")}/- (Rupees {inWords(monthlyGross)} Only), amounting to an annual gross of ₹ {annual.toLocaleString("en-IN")}/-, subject to statutory deductions as applicable.</Text>
          <Text style={s.para}>This certificate is issued at the request of the employee for bank / loan / visa or any other lawful purpose, without any liability on the part of the company.</Text>
          <Text style={s.secBand}>Employee Details</Text>
          <View style={s.table}>
            <View style={s.thRow}><Text style={s.th}>Field</Text><Text style={s.th}>Details</Text><Text style={s.th}>Field</Text><Text style={s.th}>Details</Text></View>
            {[["Name",empName,"Employee Code",empCode],["Designation",designation,"Department",department],["Date of Joining",dateOfJoining,"Monthly Gross","₹ "+monthlyGross.toLocaleString("en-IN")]].map(([k1,v1,k2,v2],i)=>(
              <View key={i} style={i%2===0?s.trEven:s.trOdd}>
                <Text style={s.tdPurple}>{k1}</Text><Text style={s.td}>{v1}</Text>
                <Text style={s.tdPurple}>{k2}</Text><Text style={s.td}>{v2}</Text>
              </View>
            ))}
          </View>
          <SigBlock signatory={signatory} sigTitle={sigTitle} />
        </LHPage>
      </Document>
    );
  }

  // Appointment
  return (
    <Document>
      <LHPage>
        <Text style={s.title}>APPOINTMENT LETTER</Text>
        <View style={s.metaRow}><Text><Text style={s.bold}>Date: </Text>{today}</Text><Text><Text style={s.bold}>Ref No: </Text>{refNumber}</Text></View>
        <Text style={{ marginBottom: 8 }}>To,{"\n"}<Text style={s.bold}>{empName}</Text>{"\n"}{designation}</Text>
        <Text style={{ marginBottom: 6 }}>Dear {empName.split(" ")[0]},</Text>
        <Text style={s.para}>{description || `With reference to your acceptance of our offer, we are pleased to appoint you as ${designation} at ${COMPANY.name} with effect from ${extra.joiningDate || dateOfJoining}.`}</Text>
        <Text style={s.para}>Your monthly gross salary will be ₹ {monthlyGross.toLocaleString("en-IN")}/- (Rupees {inWords(monthlyGross)} Only) as per the salary structure annexed, subject to statutory deductions. You will be on probation for a period of six months from the date of joining.</Text>
        <Text style={s.secBand}>COMPENSATION DETAILS</Text>
        <View style={s.table}>
          <View style={s.thRow}>
            <Text style={s.th}>Component</Text>
            <Text style={[s.th, s.tdRight]}>Monthly (₹)</Text>
            <Text style={[s.th, s.tdRight]}>Annual (₹)</Text>
          </View>
          {compRows.map((r, i) => <TableRow key={i} cells={[r.label, r.monthly.toLocaleString("en-IN"), r.annual.toLocaleString("en-IN")]} purple idx={i} />)}
          <TableRow cells={["Total Gross", totalMonthly.toLocaleString("en-IN"), totalAnnual.toLocaleString("en-IN")]} total />
        </View>
        <SigBlock signatory={signatory} sigTitle={sigTitle} />
      </LHPage>
    </Document>
  );
}
