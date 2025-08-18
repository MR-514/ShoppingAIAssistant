import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest) {
  const body = await req.json();

  const r = await fetch("http://172.16.172.16:5678/webhook/Virtual-Try-On", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await r.json();
  return NextResponse.json(data);
}
