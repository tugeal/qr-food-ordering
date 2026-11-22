import { getOrderLiveState } from "@/features/orders/queries";

export const dynamic = "force-dynamic";

/** GET /api/orders/<id>: status and payment status only, for the order page to poll. No personal data. */
export async function GET(_request: Request, { params }: { params: Promise<{ publicId: string }> }) {
  const { publicId } = await params;
  const state = await getOrderLiveState(publicId);

  if (!state) return Response.json({ error: "not_found" }, { status: 404 });
  return Response.json(state, { headers: { "Cache-Control": "no-store" } });
}
