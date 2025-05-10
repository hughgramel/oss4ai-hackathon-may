"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Define the Project type based on your table schema and usage
export type Project = {
  id: string; // Assuming UUID, adjust if it's a number
  created_at: string;
  title: string;
  description?: string | null;
  git_link?: string | null;
  status: "pending" | "approved" | "rejected" | "in_progress" | "completed"; // Extend as needed
  user_id: string; // Crucial for user-specific data
  // Add any other fields from your 'projects' table
};

/**
 * Fetches all projects for the currently authenticated user.
 */
export async function getProjectsForCurrentUser(): Promise<Project[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    // Or throw new Error("User not authenticated"); // Consider error handling strategy
    return [];
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.id) // Ensure projects are filtered by the current user
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching projects:", error.message);
    return []; // Return empty array or throw error
  }
  return data as Project[];
}

/**
 * Fetches a single project by its ID for the currently authenticated user.
 */
export async function getProjectById(projectId: string): Promise<Project | null> {
  if (!projectId) {
    console.warn("getProjectById called with no projectId");
    return null;
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .eq("user_id", user.id) // Ensure the user owns this project
    .single();

  if (error) {
    // If error is due to no rows found for .single(), it's not necessarily a console error
    if (error.code === 'PGRST116') { // PostgREST code for "GRES-000000: exactamente uma linha esperada, mas 0 linhas encontradas"
        console.log(`Project with id ${projectId} not found for user ${user.id}`);
    } else {
        console.error(`Error fetching project ${projectId}:`, error.message);
    }
    return null;
  }
  return data as Project | null;
}

/**
 * Adds a new project for the currently authenticated user.
 * This function is designed to be called from a form.
 */
export async function addProject(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: "User not authenticated. Cannot add project.", status: 401 };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string | null;
  const git_link = formData.get("git_link") as string | null;

  // Basic validation
  if (!title || title.trim() === "") {
    return { error: "Project title is required.", status: 400 };
  }

  const { data, error } = await supabase
    .from("projects")
    .insert([{
      title: title.trim(),
      description: description?.trim(),
      git_link: git_link?.trim(),
      user_id: user.id,
      status: "pending", // Default status for new projects
    }])
    .select()
    .single();

  if (error) {
    console.error("Error adding project:", error.message);
    return { error: `Database error: ${error.message}`, status: 500 };
  }

  revalidatePath("/projects"); // Update the cache for the projects page

  // Redirect to the new project's detailed view or back to projects list
  // For now, returning success with the new project data.
  // Consider redirecting: redirect(\`/projects?current_project_id=\${data.id}\`);
  return { success: true, project: data as Project, status: 201 };
} 