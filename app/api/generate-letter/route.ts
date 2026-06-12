/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import React from "react";
import { LetterPDF } from "@/components/LetterPDF";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const element = React.createElement(LetterPDF, body as any) as any;
  const buffer = await renderToBuffer(element);
  const uint8 = new Uint8Array(buffer);
  return new NextResponse(uint8, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="siyantech-${body.type}-letter.pdf"`,
    },
  });
}
