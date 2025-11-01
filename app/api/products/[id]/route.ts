import { type NextRequest, NextResponse } from "next/server"

const products: any[] = require("../route").default || []

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const id = await Promise.resolve(params.id)

  // For demo, just return success
  return NextResponse.json({ success: true })
}
