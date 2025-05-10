"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusIcon, Loader2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export function ProjectSubmissionForm() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        gitLink: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const supabase = createClient();

            // Get the current user
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) throw new Error("User not authenticated");

            const { error } = await supabase.from("projects").insert([
                {
                    title: formData.title,
                    description: formData.description,
                    git_link: formData.gitLink,
                    status: "pending",
                    user_id: user.id,
                },
            ]);

            if (error) throw error;

            // Reset form and close modal
            setFormData({ title: "", description: "", gitLink: "" });
            setIsOpen(false);
            // Refresh the page to show the new project
            window.location.reload();
        } catch (error) {
            console.error("Error submitting project:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <Button onClick={() => setIsOpen(true)} className="flex items-center gap-2" size="lg">
                <PlusIcon className="h-5 w-5" />
                Add New Project
            </Button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-background p-6 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Add New Project</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Project Title</label>
                        <Input
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Enter project title"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) =>
                                setFormData({ ...formData, description: e.target.value })
                            }
                            placeholder="Describe your project"
                            required
                            className="min-h-[100px]"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Git Repository</label>
                        <Input
                            value={formData.gitLink}
                            onChange={(e) => setFormData({ ...formData, gitLink: e.target.value })}
                            placeholder="https://github.com/username/repo"
                            type="url"
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                "Submit Project"
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
