import { createClient } from "@/utils/supabase/server";
import { ListChecksIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function TasksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12 items-center px-4 py-8">
      <div className="w-full max-w-3xl">
        <div className="bg-muted/30 border text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
          <ListChecksIcon size="16" strokeWidth={2} />
          Detailed task view and management.
        </div>
      </div>
      <div className="flex flex-col gap-6 items-start w-full max-w-3xl">
        <h1 className="font-bold text-4xl mb-4">Task View</h1>
        <p className="text-lg text-muted-foreground">
          Manage comments, subtasks, and history for individual tasks.
        </p>
        <div className="w-full p-8 border rounded-lg bg-card text-card-foreground">
          <p>Detailed task information will appear here.</p>
        </div>
      </div>
    </div>
  );
} 