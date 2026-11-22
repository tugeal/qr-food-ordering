import { getOrderStatus } from "@/features/orders/queries";

export const dynamic = "force-dynamic";

/** GET /api/orders/<id>: just the status, for the order page to poll. No personal data. */
export async function GET(_request: Request, { params }: { params: Promise<{ publicId: string }> }) {
  const { publicId } = await params;
  const status = await getOrderStatus(publicId);

  if (!status) return Response.json({ error: "not_found" }, { status: 404 });
  return Response.json({ status }, { headers: { "Cache-Control": "no-store" } });
}
