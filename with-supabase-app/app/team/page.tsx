import { createClient } from "@/utils/supabase/server";
import { InfoIcon, UsersIcon } from "lucide-react"; // Added UsersIcon
import { redirect } from "next/navigation";

export default async function TeamPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12 items-center px-4 py-8">
      <div className="w-full max-w-3xl">
        <div className="bg-muted/30 border text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <UsersIcon size="16" strokeWidth={2} />
          Manage your team members and their roles.
        </div>
      </div>
      <div className="flex flex-col gap-6 items-start w-full max-w-3xl">
        <h1 className="font-bold text-4xl mb-4">Team Management</h1>
        <p className="text-lg text-muted-foreground">
          Oversee your team members, assign roles, and track progress.
        </p>
        {/* Placeholder for future team list */}
        <div className="w-full p-8 border rounded-lg bg-card text-card-foreground">
          <p>A list of your team members will appear here.</p>
          {/* Example: You could map over team member data here */}
        </div>
      </div>
      <div className="flex flex-col gap-2 items-start w-full max-w-3xl mt-8">
        <h2 className="font-bold text-xl mb-2">User Information</h2>
        <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto bg-background text-foreground w-full">
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
    </div>
  );
} 