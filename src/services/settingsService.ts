import fs from "fs/promises";
import path from "path";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const settingsFilePath = path.join(process.cwd(), "src", "data", "settings.json");

interface AppSettings {
  resumeUrl: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  resumeUrl: "/uploads/curriculo.pdf",
};

async function readLocalSettings(): Promise<AppSettings> {
  try {
    const data = await fs.readFile(settingsFilePath, "utf-8");
    return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

async function writeLocalSettings(settings: AppSettings): Promise<void> {
  try {
    await fs.writeFile(settingsFilePath, JSON.stringify(settings, null, 2), "utf-8");
  } catch (error) {
    console.error("Error writing settings.json:", error);
  }
}

export async function getSettings(): Promise<AppSettings> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.from("settings").select("*").eq("key", "app_settings").single();
      if (!error && data && data.value) {
        return { ...DEFAULT_SETTINGS, ...data.value };
      }
    } catch (err) {
      console.error("Supabase settings fetch error:", err);
    }
  }
  return readLocalSettings();
}

export async function updateSettings(newSettings: Partial<AppSettings>): Promise<AppSettings> {
  const current = await getSettings();
  const updated = { ...current, ...newSettings };

  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.from("settings").upsert({ key: "app_settings", value: updated });
    } catch (err) {
      console.error("Supabase settings update error:", err);
    }
  }

  await writeLocalSettings(updated);
  return updated;
}
