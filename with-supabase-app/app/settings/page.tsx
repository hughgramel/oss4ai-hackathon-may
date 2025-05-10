import { createClient } from "@/utils/supabase/server";
import { SettingsIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12 items-center px-4 py-8">
      <div className="w-full max-w-3xl">
        <div className="bg-muted/30 border text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <SettingsIcon size="16" strokeWidth={2} />
          Configure your workspace and user settings.
        </div>
      </div>
      <div className="flex flex-col gap-6 items-start w-full max-w-3xl">
        <h1 className="font-bold text-4xl mb-4">Settings</h1>
        <p className="text-lg text-muted-foreground">
          Manage your profile, preferences, and workspace configurations.
        </p>
        <div className="w-full p-8 border rounded-lg bg-card text-card-foreground">
          <p className="font-semibold">User Profile:</p>
          <pre className="text-xs font-mono p-3 my-2 rounded border max-h-48 overflow-auto bg-background text-foreground w-full">
            {JSON.stringify(user, null, 2)}
          </pre>
          <p>Other settings will appear here.</p>
        </div>
      </div>
    </div>
  );
} 