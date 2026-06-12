import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { createElement } from "react";
import { LetterPDF } from "@/components/LetterPDF";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const buffer = await renderToBuffer(createElement(LetterPDF, body));
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${body.type}-${Date.now()}.pdf"`,
    },
  });
}
