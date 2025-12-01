import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { password } = await req.json();

  if (!password) {
    return NextResponse.json(
      { error: "Senha obrigatoria" },
      { status: 400 }
    );
  }

  if (password !== process.env.ADMIN_PANEL_PASSWORD) {
    return NextResponse.json(
      { error: "Senha invalida" },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ ok: true });

  res.cookies.set("admin_session", "ok", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 4, // 4 horas
    path: "/",
  });

  return res;
}
