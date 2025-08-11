import { NextRequest, NextResponse } from "next/server"
import { mkdir, writeFile } from "fs/promises"
import path from "path"
import crypto from "crypto"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "Missing 'file' in form-data" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const originalName = file.name || "upload.png"
    const ext = (originalName.split(".").pop() || "png").toLowerCase()
    const safeExt = ext.replace(/[^a-z0-9]/gi, "") || "png"

    const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${safeExt}`

    const uploadDir = path.join(process.cwd(), "public", "uploads")
    await mkdir(uploadDir, { recursive: true })

    const filePath = path.join(uploadDir, filename)
    await writeFile(filePath, buffer)

    const publicPath = `/uploads/${filename}`
    const absoluteUrl = `${process.env.NEXT_PUBLIC_APP_URL || ""}${publicPath}` || publicPath

    return NextResponse.json({ url: absoluteUrl, path: publicPath, name: filename, size: buffer.length })
  } catch (err) {
    return NextResponse.json({ error: "Upload failed", details: `${err}` }, { status: 500 })
  }
} 