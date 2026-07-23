import { NextResponse } from "next/server";
import { addMessage, getAllMessages, deleteMessage } from "@/services/contactService";

export async function GET() {
  try {
    const messages = await getAllMessages();
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: "Erro ao buscar mensagens" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Preencha os campos obrigatórios (Nome, E-mail e Mensagem)" }, { status: 400 });
    }

    // Save message locally / in Supabase DB
    const saved = await addMessage({
      name,
      email,
      subject: subject || "Novo Contato pelo Portfólio",
      message,
    });

    // 1. Send free email via Resend if RESEND_API_KEY is configured
    const resendApiKey = process.env.RESEND_API_KEY;
    const web3FormsKey = process.env.WEB3FORMS_ACCESS_KEY;
    const targetEmail = process.env.EMAIL_TO || "eliabe.developer@gmail.com";

    let emailSent = false;

    if (resendApiKey) {
      try {
        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "Portfolio Contact <onboarding@resend.dev>",
            to: targetEmail,
            subject: `[Contato Portfolio] ${subject || name}`,
            html: `
              <h2>Nova Mensagem Recebida do Portfólio</h2>
              <p><strong>Nome:</strong> ${name}</p>
              <p><strong>E-mail:</strong> ${email}</p>
              <p><strong>Assunto:</strong> ${subject || "Sem assunto"}</p>
              <p><strong>Mensagem:</strong></p>
              <blockquote style="background:#f4f4f4; padding:12px; border-left:4px solid #e84040;">${message}</blockquote>
            `,
          }),
        });
        if (resendRes.ok) emailSent = true;
      } catch (emailErr) {
        console.error("Erro ao enviar e-mail via Resend:", emailErr);
      }
    }

    if (!emailSent && web3FormsKey) {
      try {
        const web3Res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_key: web3FormsKey,
            name,
            email,
            subject: `[Contato Portfolio] ${subject || name}`,
            message,
          }),
        });
        if (web3Res.ok) emailSent = true;
      } catch (web3Err) {
        console.error("Erro ao enviar e-mail via Web3Forms:", web3Err);
      }
    }

    // Fallback: Free zero-config email dispatch via FormSubmit.co
    if (!emailSent) {
      try {
        await fetch(`https://formsubmit.co/ajax/${targetEmail}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Referer: "https://portfolio-eliabe-santos.vercel.app",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
          },
          body: JSON.stringify({
            name,
            email,
            _subject: `[Contato Portfolio] ${subject || name}`,
            message: `Nova mensagem enviada por ${name} (${email}):\n\n${message}`,
          }),
        });
      } catch (formSubmitErr) {
        console.error("Erro ao enviar e-mail via FormSubmit:", formSubmitErr);
      }
    }

    return NextResponse.json({ success: true, id: saved.id }, { status: 201 });
  } catch (error) {
    console.error("Erro no envio de mensagem:", error);
    return NextResponse.json({ error: "Erro ao processar envio de mensagem" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID da mensagem não fornecido" }, { status: 400 });
    }

    await deleteMessage(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erro ao excluir mensagem" }, { status: 500 });
  }
}
