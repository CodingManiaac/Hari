import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const assetPath = params.path.join("/");
  
  // Check if asset exists under public folder (preferred for Vercel CDN hosting)
  const publicPath = path.join(process.cwd(), "public", assetPath);
  if (fs.existsSync(publicPath)) {
    return NextResponse.redirect(new URL("/" + assetPath, request.url));
  }

  const filePath = path.join(process.cwd(), assetPath);

  // Security check to prevent directory traversal
  const resolvedBase = path.resolve(process.cwd());
  const resolvedTarget = path.resolve(filePath);

  if (!resolvedTarget.startsWith(resolvedBase)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  if (!fs.existsSync(filePath)) {
    return new NextResponse("Asset Not Found", { status: 404 });
  }

  try {
    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();

    const mimeTypes: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
      ".mp3": "audio/mpeg",
      ".mp4": "video/mp4",
      ".json": "application/json",
    };

    const contentType = mimeTypes[ext] || "application/octet-stream";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
