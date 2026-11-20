import QRCode from "qrcode";
import { getMenuUrl } from "@/features/settings/queries";

export const dynamic = "force-dynamic";

/** GET /api/qr[?format=png][&download=1]: the menu QR code as SVG (default) or PNG. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") === "png" ? "png" : "svg";
  const menuUrl = await getMenuUrl();

  const headers = new Headers({ "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" });
  if (searchParams.has("download")) {
    headers.set("Content-Disposition", `attachment; filename="menu-qr.${format}"`);
  }

  if (format === "png") {
    const png = await QRCode.toBuffer(menuUrl, { width: 1024, margin: 2, errorCorrectionLevel: "M" });
    headers.set("Content-Type", "image/png");
    return new Response(new Uint8Array(png), { headers });
  }

  const svg = await QRCode.toString(menuUrl, { type: "svg", margin: 2, errorCorrectionLevel: "M" });
  headers.set("Content-Type", "image/svg+xml");
  return new Response(svg, { headers });
}
