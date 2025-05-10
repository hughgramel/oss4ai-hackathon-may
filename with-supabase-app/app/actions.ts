"use server";

import { encodedRedirect } from "@/utils/utils";
import { createClient } from "@/utils/supabase/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export const signUpAction = async (formData: FormData) => {
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();
    const supabase = await createClient();
    const origin = (await headers()).get("origin");

    if (!email || !password) {
        return encodedRedirect("error", "/sign-up", "Email and password are required");
    }

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${origin}/auth/callback`,
        },
    });

    if (error) {
        console.error(error.code + " " + error.message);
        return encodedRedirect("error", "/sign-up", error.message);
    } else {
        return encodedRedirect(
            "success",
            "/sign-up",
            "Thanks for signing up! Please check your email for a verification link."
        );
    }
};

export const signInAction = async (formData: FormData) => {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return encodedRedirect("error", "/sign-in", error.message);
    }

    return redirect("/protected");
};

export const forgotPasswordAction = async (formData: FormData) => {
    const email = formData.get("email")?.toString();
    const supabase = await createClient();
    const origin = (await headers()).get("origin");
    const callbackUrl = formData.get("callbackUrl")?.toString();

    if (!email) {
        return encodedRedirect("error", "/forgot-password", "Email is required");
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/callback?redirect_to=/protected/reset-password`,
    });

    if (error) {
        console.error(error.message);
        return encodedRedirect("error", "/forgot-password", "Could not reset password");
    }

    if (callbackUrl) {
        return redirect(callbackUrl);
    }

    return encodedRedirect(
        "success",
        "/forgot-password",
        "Check your email for a link to reset your password."
    );
};

export const resetPasswordAction = async (formData: FormData) => {
    const supabase = await createClient();

    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!password || !confirmPassword) {
        encodedRedirect(
            "error",
            "/protected/reset-password",
            "Password and confirm password are required"
        );
    }

    if (password !== confirmPassword) {
        encodedRedirect("error", "/protected/reset-password", "Passwords do not match");
    }

    const { error } = await supabase.auth.updateUser({
        password: password,
    });

    if (error) {
        encodedRedirect("error", "/protected/reset-password", "Password update failed");
    }

    encodedRedirect("success", "/protected/reset-password", "Password updated");
};

export const signOutAction = async () => {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return redirect("/sign-in");
};

export async function processProject(projectId: number) {
    const supabase = await createClient();

    try {
        // Get the project details
        const { data: project, error: fetchError } = await supabase
            .from("projects")
            .select("*")
            .eq("id", projectId)
            .single();

        if (fetchError) throw fetchError;
        if (!project) throw new Error("Project not found");

        // Initialize the model
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Generate project analysis and subgoals
        const prompt = `Analyze this AI project and break it down into actionable subgoals:
    Title: ${project.title}
    Description: ${project.description}
    ${project.git_link ? `Repository: ${project.git_link}` : ""}

    Please provide:
    1. A brief analysis of the project scope and complexity
    2. A list of 5-7 specific, actionable subgoals
    3. Estimated timeline for each subgoal
    4. Key technical challenges to consider
    5. Recommended tools and technologies

    Format the response in a structured way that can be stored in a database.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const analysis = response.text();

        // Update the project with the analysis
        const { error: updateError } = await supabase
            .from("projects")
            .update({
                status: "approved",
                analysis: analysis,
                processed_at: new Date().toISOString(),
            })
            .eq("id", projectId);

        if (updateError) throw updateError;

        return { success: true, analysis };
    } catch (error) {
        console.error("Error processing project:", error);
        return { success: false, error: "Failed to process project" };
    }
}

// Function to handle new project creation
export async function handleNewProject(projectId: number) {
    // Process the project
    const result = await processProject(projectId);

    if (!result.success) {
        // If processing fails, update the project status to rejected
        const supabase = await createClient();
        await supabase
            .from("projects")
            .update({
                status: "rejected",
                error_message: result.error,
            })
            .eq("id", projectId);
    }
}
