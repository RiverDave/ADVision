import { NextRequest, NextResponse } from "next/server"

//TODO: Use .env later
const prod = false

const URL = prod
  ? "https://advision-api-918900764545.us-central1.run.app/imgtoad"
  : "http://localhost:8080/imgtoad"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const image = formData.get("image")
    const url = formData.get("url")
    const body = new FormData()

    if (image && image instanceof Blob) {
      const buffer = await image.arrayBuffer()
      const file = new Blob([buffer], { type: image.type })
      body.append("image", file, (image as File).name || "image.jpg")
    } else if (url) {
      body.append("url", url as string)
    } else {
      return NextResponse.json(
        { error: "No file or URL provided" },
        { status: 400 }
      )
    }

    const response = await fetch(URL, {
      method: "POST",
      body,
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`Failed to analyze image: ${errorText}`)
    }

    const data = await response.json()
    return NextResponse.json(data, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { error: "Internal server error", details: (error as Error).message },
      { status: 500 }
    )
  }
}