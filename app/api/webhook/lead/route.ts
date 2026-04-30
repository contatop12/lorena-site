import { NextResponse } from "next/server";

const DEFAULT_WEBHOOK_URL = "https://python-auto-relatorio-trafego.axmxa0.easypanel.host/site-new-lead";

export async function POST(request: Request) {
  const webhookUrl = process.env.WEBHOOK_URL || DEFAULT_WEBHOOK_URL;
  const webhookToken = (process.env.WEBHOOK_TOKEN || "").trim();

  if (!webhookToken) {
    return NextResponse.json(
      { ok: false, error: "WEBHOOK_TOKEN ausente no ambiente do site." },
      { status: 500 }
    );
  }

  let payload = {};
  try {
    payload = await request.json();
  } catch (_) {
    return NextResponse.json(
      { ok: false, error: "Payload inválido para o relay do webhook." },
      { status: 400 }
    );
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${webhookToken}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const txt = await res.text().catch(() => "");
      return NextResponse.json(
        {
          ok: false,
          error: `Webhook retornou HTTP ${res.status}`,
          detail: txt || undefined,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: "Falha de rede ao enviar webhook.",
        detail: String(error),
      },
      { status: 502 }
    );
  }
}
