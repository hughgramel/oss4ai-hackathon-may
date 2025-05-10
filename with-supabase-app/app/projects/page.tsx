import { createClient } from "@/utils/supabase/server";
import { BriefcaseIcon, GithubIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { ProjectSubmissionForm } from "@/components/project-submission-form";

export default async function ProjectsPage() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return redirect("/sign-in");
    }

    const { data: projects } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div className="flex-1 w-full flex flex-col gap-12 items-center px-4 py-8">
            <div className="w-full max-w-3xl">
                <div className="bg-muted/30 border text-sm p-3 px-5 rounded-md text-foreground flex gap-3 items-center">
                    <BriefcaseIcon size="16" strokeWidth={2} />
                    Manage all your projects from this page.
                </div>
            </div>
            <div className="flex flex-col gap-6 items-start w-full max-w-3xl">
                <div className="flex justify-between items-center w-full">
                    <h1 className="font-bold text-4xl">Your Projects</h1>
                    <ProjectSubmissionForm />
                </div>
                <p className="text-lg text-muted-foreground">
                    View, create, and manage your ongoing projects.
                </p>
                <div className="w-full space-y-4">
                    {projects && projects.length > 0 ? (
                        projects.map((project) => (
                            <div
                                key={project.id}
                                className="p-6 border rounded-lg bg-card text-card-foreground hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-semibold mb-2">
                                            {project.title}
                                        </h3>
                                        <p className="text-muted-foreground mb-4">
                                            {project.description}
                                        </p>
                                        {project.git_link && (
                                            <a
                                                href={project.git_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                                            >
                                                <GithubIcon className="h-4 w-4" />
                                                View Repository
                                            </a>
                                        )}
                                    </div>
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            project.status === "pending"
                                                ? "bg-yellow-100 text-yellow-800"
                                                : project.status === "approved"
                                                  ? "bg-green-100 text-green-800"
                                                  : "bg-red-100 text-red-800"
                                        }`}
                                    >
                                        {project.status.charAt(0).toUpperCase() +
                                            project.status.slice(1)}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="w-full p-8 border rounded-lg bg-card text-card-foreground text-center">
                            <p className="text-muted-foreground">
                                No projects yet. Add your first project!
                            </p>
                        </div>
                    )}
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
