import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SettingsIcon } from "lucide-react";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-8 items-center px-4 py-8">
      <div className="w-full max-w-4xl">
        <div className="bg-muted/30 border text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center mb-6">
          <SettingsIcon size="16" strokeWidth={2} />
          Application and Workspace Settings
        </div>
        <h1 className="font-bold text-3xl sm:text-4xl mb-4">Settings</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Manage your workspace configurations, user profile, and application preferences.
        </p>
        <div className="w-full p-8 border rounded-lg bg-card text-card-foreground min-h-[300px]">
          <p>Settings and configuration options will appear here.</p>
          {/* Placeholder for settings forms/components */}
        </div>
      </div>
    </div>
  );
} 