import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { LetterPDF } from "@/components/LetterPDF";

export async function POST(req: NextRequest) {
  const body = await req.json();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const element = React.createElement(LetterPDF, body) as any;
  const buffer = await renderToBuffer(element);
  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="siyantech-${body.type}-letter.pdf"`,
    },
  });
}
