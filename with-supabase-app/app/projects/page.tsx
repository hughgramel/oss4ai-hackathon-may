import { createClient } from "@/utils/supabase/server";
import { BriefcaseIcon, GithubIcon, PlusCircleIcon } from "lucide-react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ProjectSubmissionForm } from "@/components/project-submission-form";
import ProjectSelector from "@/components/project-selector";
import { getProjectsForCurrentUser, getProjectById, type Project } from "@/app/projectActions";

export default async function ProjectsPage({ searchParams }: { searchParams?: { current_project_id?: string } }){
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/sign-in");
    }

    const allProjects = await getProjectsForCurrentUser();
    const currentProjectIdFromParams = searchParams?.current_project_id;
    let selectedProject: Project | null = null;

    if (currentProjectIdFromParams && currentProjectIdFromParams !== "all") {
        selectedProject = await getProjectById(currentProjectIdFromParams);
    }

    return (
        <div className="flex-1 w-full flex flex-col gap-8 items-center px-4 py-8">
            <div className="w-full max-w-4xl flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
                <h1 className="font-bold text-3xl sm:text-4xl">Your Projects</h1>
                <ProjectSelector projects={allProjects} currentProjectId={currentProjectIdFromParams} className="w-full sm:w-auto"/>
            </div>

            {!selectedProject && (
                <div className="w-full max-w-4xl p-4 border rounded-lg bg-card shadow mb-8">
                     <h2 className="text-xl font-semibold mb-3">Add New Project</h2>
                    <ProjectSubmissionForm />
                </div>
            )}

            <div className="w-full max-w-4xl">
                {selectedProject ? (
                    <div className="p-6 border rounded-lg bg-card text-card-foreground shadow-lg">
                        <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
                            <h2 className="text-2xl font-semibold mb-2 sm:mb-0">{selectedProject.title}</h2>
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${selectedProject.status === "pending" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                    : selectedProject.status === "approved" || selectedProject.status === "in_progress" || selectedProject.status === "completed" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"}`}
                            >
                                {selectedProject.status.charAt(0).toUpperCase() + selectedProject.status.slice(1)}
                            </span>
                        </div>
                        <p className="text-muted-foreground mb-3">{selectedProject.description || "No description provided."}</p>
                        {selectedProject.git_link && (
                            <a
                                href={selectedProject.git_link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-4"
                            >
                                <GithubIcon className="h-4 w-4" />
                                View Repository
                            </a>
                        )}
                        <div className="mt-6 border-t pt-6">
                            <h4 className="font-semibold text-lg mb-3">Project Details & Tasks (Placeholder)</h4>
                            <p className="text-muted-foreground">
                                Detailed information, tasks, Kanban board, and other management tools for '{selectedProject.title}' would appear here.
                            </p>
                            <div className="mt-4 flex gap-2">
                                <Link href={`/kanban?project_id=${selectedProject.id}`} className="text-sm text-primary hover:underline">View Kanban</Link>
                                <Link href={`/tasks?project_id=${selectedProject.id}`} className="text-sm text-primary hover:underline">View Tasks</Link>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {allProjects && allProjects.length > 0 ? (
                            allProjects.map((project: Project) => (
                                <div
                                    key={project.id}
                                    className="p-6 border rounded-lg bg-card text-card-foreground hover:shadow-md transition-shadow"
                                >
                                    <div className="flex flex-col sm:flex-row justify-between items-start">
                                        <div className="mb-2 sm:mb-0">
                                            <h3 className="text-xl font-semibold mb-1">{project.title}</h3>
                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{project.description || "No description."}</p>
                                            {project.git_link && (
                                                <a
                                                    href={project.git_link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                                                >
                                                    <GithubIcon className="h-3 w-3" />
                                                    Repository
                                                </a>
                                            )}
                                        </div>
                                        <span
                                            className={`px-2 py-0.5 rounded-full text-xs font-medium whitespace-nowrap ${project.status === "pending" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                                : project.status === "approved" || project.status === "in_progress" || project.status === "completed" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"}`}
                                        >
                                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                        </span>
                                    </div>
                                    <div className="mt-3 pt-3 border-t">
                                     <Link href={`/projects?current_project_id=${project.id}`} className="text-sm font-medium text-primary hover:underline">
                                        View Details
                                     </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-10 px-6 border rounded-lg bg-card">
                                <BriefcaseIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-2 text-lg font-medium text-foreground">No projects yet</h3>
                                <p className="mt-1 text-sm text-muted-foreground">Get started by adding your first project.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {user && (
                 <div className="w-full max-w-4xl mt-10 pt-6 border-t">
                    <h2 className="font-semibold text-lg mb-2">User Information</h2>
                    <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto bg-muted text-muted-foreground w-full">
                        {JSON.stringify(user, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}
