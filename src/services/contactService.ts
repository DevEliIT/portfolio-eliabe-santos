import fs from "fs/promises";
import path from "path";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

const messagesFilePath = path.join(process.cwd(), "src", "data", "contact_messages.json");

async function readLocalMessages(): Promise<ContactMessage[]> {
  try {
    const data = await fs.readFile(messagesFilePath, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeLocalMessages(messages: ContactMessage[]): Promise<void> {
  try {
    await fs.writeFile(messagesFilePath, JSON.stringify(messages, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing contact_messages.json:", error);
  }
}

export async function getAllMessages(): Promise<ContactMessage[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
      if (!error && data) {
        return data.map((item: any) => ({
          id: item.id,
          name: item.name,
          email: item.email,
          subject: item.subject,
          message: item.message,
          createdAt: item.created_at || item.createdAt || new Date().toISOString(),
        }));
      }
    } catch (err) {
      console.error("Supabase messages fetch error:", err);
    }
  }

  const list = await readLocalMessages();
  return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function addMessage(data: { name: string; email: string; subject: string; message: string }): Promise<ContactMessage> {
  const newMessage: ContactMessage = {
    id: Date.now().toString(),
    name: data.name,
    email: data.email,
    subject: data.subject || "Novo Contato pelo Portfólio",
    message: data.message,
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from("contact_messages").insert([{
        id: newMessage.id,
        name: newMessage.name,
        email: newMessage.email,
        subject: newMessage.subject,
        message: newMessage.message,
        created_at: newMessage.createdAt,
      }]);
    } catch (err) {
      console.error("Supabase message insert error:", err);
    }
  }

  const localList = await readLocalMessages();
  localList.unshift(newMessage);
  await writeLocalMessages(localList);

  return newMessage;
}

export async function deleteMessage(id: string): Promise<boolean> {
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from("contact_messages").delete().eq("id", id);
    } catch (err) {
      console.error("Supabase message delete error:", err);
    }
  }

  const list = await readLocalMessages();
  const filtered = list.filter((m) => m.id !== id);
  await writeLocalMessages(filtered);
  return true;
}
