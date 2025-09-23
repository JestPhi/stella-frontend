import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  console.log("Simple test route called");
  return NextResponse.json({ message: "Test route working" });
}

export async function PATCH(request: NextRequest) {
  console.log("Simple test PATCH route called");
  const body = await request.json();
  console.log("Body:", body);
  return NextResponse.json({ message: "Test PATCH working", received: body });
}
