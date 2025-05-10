import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { LayoutDashboardIcon } from "lucide-react"; // Using LayoutDashboard for Kanban, can be changed

export default async function KanbanPage({ searchParams }: { searchParams?: { project_id?: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  const projectId = searchParams?.project_id;

  // You can fetch project-specific Kanban data here if projectId is present
  // For now, it's a generic placeholder

  return (
    <div className="flex-1 w-full flex flex-col gap-8 items-center px-4 py-8">
      <div className="w-full max-w-4xl">
        <div className="bg-muted/30 border text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center mb-6">
          <LayoutDashboardIcon size="16" strokeWidth={2} />
          {projectId ? `Kanban Board for Project ID: ${projectId}` : "Kanban Board"}
        </div>
        <h1 className="font-bold text-3xl sm:text-4xl mb-4">Project Kanban Board</h1>
        <p className="text-lg text-muted-foreground mb-6">
          Visualize and manage your project tasks using a Kanban interface.
        </p>
        <div className="w-full p-8 border rounded-lg bg-card text-card-foreground min-h-[300px]">
          <p>The Kanban board for {projectId ? `project ${projectId}` : "the selected project"} will be displayed here.</p>
          {/* Placeholder for Kanban board component */}
        </div>
      </div>
    </div>
  );
} 