import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { ListChecksIcon } from "lucide-react";

export default async function TasksPage({ searchParams }: { searchParams?: { project_id?: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }
  const projectId = searchParams?.project_id;

  return (
    <div className="flex-1 w-full flex flex-col gap-8 items-center px-4 py-8">
      <div className="w-full max-w-4xl">
        <div className="bg-muted/30 border text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center mb-6">
          <ListChecksIcon size="16" strokeWidth={2} />
          {projectId ? `Task View for Project ID: ${projectId}` : "Task View"}
        </div>
        <h1 className="font-bold text-3xl sm:text-4xl mb-4">Task Management</h1>
        <p className="text-lg text-muted-foreground mb-6">
          View and manage detailed tasks, subtasks, comments, and history.
        </p>
        <div className="w-full p-8 border rounded-lg bg-card text-card-foreground min-h-[300px]">
          <p>Detailed task view for {projectId ? `project ${projectId}` : "the selected project"} will appear here.</p>
          {/* Placeholder for task view component */}
        </div>
      </div>
    </div>
  );
} 