import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("challenge_completions")
    .select(
      [
        "id",
        "challenge_name",
        "challenge_slug",
        "full_name",
        "state",
        "city",
        "whatsapp",
        "order_number",
        "strava_screenshot_url",
        "created_at",
        "is_confirmed",
      ].join(",")
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao buscar challenge_completions:", error);
    return NextResponse.json(
      { error: "Erro ao carregar registros" },
      { status: 500 }
    );
  }

  return NextResponse.json({ data });
}
