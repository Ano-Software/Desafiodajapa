import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "ID do desafio nao informado." },
      { status: 400 }
    );
  }

  let body: {
    name?: unknown;
    slug?: unknown;
    is_active?: unknown;
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Formato do corpo invalido." },
      { status: 400 }
    );
  }

  const updates: Record<string, unknown> = {};

  if (typeof body.name === "string") {
    updates.name = body.name.trim();
  }

  if (typeof body.slug === "string") {
    updates.slug = body.slug.trim();
  }

  if (typeof body.is_active === "boolean") {
    updates.is_active = body.is_active;
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: "Nenhum campo valido informado para atualizacao." },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("admin_challenges")
    .update(updates)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    console.error("Erro ao atualizar admin_challenge:", error);
    return NextResponse.json(
      { error: "Nao foi possivel atualizar o desafio." },
      { status: 500 }
    );
  }

  return NextResponse.json({ data });
}

export async function DELETE(_: NextRequest, context: RouteContext) {
  const { id } = await context.params;

  if (!id) {
    return NextResponse.json(
      { error: "ID do desafio nao informado." },
      { status: 400 }
    );
  }

  const { error } = await supabaseAdmin
    .from("admin_challenges")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Erro ao excluir admin_challenge:", error);
    return NextResponse.json(
      { error: "Nao foi possivel excluir o desafio." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
