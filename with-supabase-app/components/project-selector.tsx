"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { type Project } from "@/app/projectActions"; // Corrected path
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Assuming shadcn/ui select is available
import { useEffect, useState } from "react";

interface ProjectSelectorProps {
  projects: Project[];
  currentProjectId?: string | null;
  className?: string;
  // Add placeholder if needed, e.g., placeholder?: string;
}

export default function ProjectSelector({
  projects,
  currentProjectId,
  className,
}: ProjectSelectorProps) {
  const router = useRouter();
  const pathname = usePathname(); // Get current pathname
  const searchParams = useSearchParams()!;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleProjectChange = (projectId: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    if (projectId === "all" || !projectId) {
      newParams.delete("current_project_id");
    } else {
      newParams.set("current_project_id", projectId);
    }
    // Preserve other existing search params
    router.push(`${pathname}?${newParams.toString()}`);
  };

  if (!mounted) {
    // Basic SSR fallback to avoid layout shift or hydration errors
    // You can customize this placeholder or return null
    return (
      <div className={`${className || ''} w-[200px] sm:w-[280px]`}>
        <Select disabled>
          <SelectTrigger>
            <SelectValue placeholder="Loading projects..." />
          </SelectTrigger>
        </Select>
      </div>
    );
  }

  return (
    <div className={`${className || ''} w-[200px] sm:w-[280px]`}>
      <Select
        value={currentProjectId || "all"} // Default to "all" if no project is selected
        onValueChange={handleProjectChange}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a project" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">View All Projects</SelectItem>
          {projects.length > 0 ? (
            projects.map((project) => (
              <SelectItem key={project.id} value={project.id.toString()}>
                {project.title}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no_projects" disabled>
              No projects found
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
} 