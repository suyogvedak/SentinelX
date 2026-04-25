import { NextRequest, NextResponse } from "next/server";
import clientPromise from "../../lib/mongodb";

/* ================= HELPERS ================= */

function isEmergency(text: string) {
  const t = text.toLowerCase();
  return (
    t.includes("help") ||
    t.includes("emergency") ||
    t.includes("danger") ||
    t.includes("attack") ||
    t.includes("fire") ||
    t.includes("hurt")
  );
}

function aiLikeReply(input: string, history: string[]) {
  const text = input.toLowerCase();

  if (isEmergency(text)) {
    return {
      reply:
        "🚨 I’m concerned about your safety. Please press the SOS button now. " +
        "I’ve flagged this conversation for the emergency team.",
      escalate: true,
    };
  }

  if (text.includes("where am i")) {
    return {
      reply:
        "📍 If location access is enabled, your SOS will include your live coordinates.",
      escalate: false,
    };
  }

  if (text.includes("what should i do")) {
    return {
      reply:
        "🧠 Stay calm, move to a safe place if possible, and keep your phone charged. " +
        "I’m here with you.",
      escalate: false,
    };
  }

  // AI-style fallback using context
  return {
    reply:
      "I understand. Can you tell me a bit more about what’s happening right now?",
    escalate: false,
  };
}

/* ================= ROUTE ================= */

export async function POST(req: NextRequest) {
  try {
    const { sessionId, message } = await req.json();

    if (!sessionId || !message) {
      return NextResponse.json(
        { error: "Missing fields" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("sentinelx");
    const chats = db.collection("chat_messages");

    // Fetch last 5 messages for context
    const historyDocs = await chats
      .find({ sessionId })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray();

    const history = historyDocs.map((h) => h.message);

    const ai = aiLikeReply(message, history);

    // Store user message
    await chats.insertOne({
      sessionId,
      from: "user",
      message,
      isEmergency: isEmergency(message),
      createdAt: new Date(),
    });

    // Store bot reply
    await chats.insertOne({
      sessionId,
      from: "bot",
      message: ai.reply,
      isEmergency: ai.escalate,
      createdAt: new Date(),
    });

    return NextResponse.json({
      reply: ai.reply,
      escalate: ai.escalate,
    });
  } catch (err) {
    console.error("CHAT ERROR:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
