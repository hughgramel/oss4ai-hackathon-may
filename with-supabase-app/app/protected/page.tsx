import { createClient } from "@/utils/supabase/server";
import { InfoIcon } from "lucide-react";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
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
                    <InfoIcon size="16" strokeWidth={2} />
                    Welcome to your Project Pilot Dashboard. More features coming soon!
                </div>
            </div>
            <div className="flex flex-col gap-6 items-start w-full max-w-3xl">
                <h1 className="font-bold text-4xl mb-4">Project Pilot Dashboard</h1>
                <p className="text-lg text-muted-foreground">
                    Overview of your projects and team activities.
                </p>
                {/* Placeholder for future dashboard content */}
                <div className="w-full p-8 border rounded-lg bg-card text-card-foreground">
                    <p>Your projects will appear here.</p>
                </div>
            </div>
            <div className="flex flex-col gap-2 items-start w-full max-w-3xl">
                <h2 className="font-bold text-2xl mb-4">Your user details</h2>
                <pre className="text-xs font-mono p-3 rounded border max-h-32 overflow-auto bg-background text-foreground w-full">
                    {JSON.stringify(user, null, 2)}
                </pre>
            </div>
        </div>
    );
}
