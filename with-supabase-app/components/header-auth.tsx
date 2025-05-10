import { signOutAction } from "@/app/actions";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!hasEnvVars) {
    return (
      <>
        <div className="flex gap-4 items-center">
          <div>
            <Badge
              variant={"default"}
              className="font-normal pointer-events-none"
            >
              Please update .env.local file with anon key and url
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              asChild
              size="sm"
              variant={"outline"}
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/sign-in">Sign in</Link>
            </Button>
            <Button
              asChild
              size="sm"
              variant={"default"}
              disabled
              className="opacity-75 cursor-none pointer-events-none"
            >
              <Link href="/sign-up">Sign up</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }
  return user ? (
    <div className="flex items-center gap-x-2 sm:gap-x-3">
      <span className="text-sm text-muted-foreground hidden sm:inline-block">{user.email}</span>
      <nav className="flex flex-wrap gap-1 sm:gap-2">
        <Button asChild size="sm" variant={"ghost"} className="text-sm px-2 sm:px-3">
          <Link href="/protected">Dashboard</Link>
        </Button>
        <Button asChild size="sm" variant={"ghost"} className="text-sm px-2 sm:px-3">
          <Link href="/projects">Projects</Link>
        </Button>
        <Button asChild size="sm" variant={"ghost"} className="text-sm px-2 sm:px-3">
          <Link href="/kanban">Kanban</Link>
        </Button>
        <Button asChild size="sm" variant={"ghost"} className="text-sm px-2 sm:px-3">
          <Link href="/tasks">Tasks</Link>
        </Button>
        <Button asChild size="sm" variant={"ghost"} className="text-sm px-2 sm:px-3">
          <Link href="/team">Team</Link>
        </Button>
        <Button asChild size="sm" variant={"ghost"} className="text-sm px-2 sm:px-3">
          <Link href="/chatbot">Chatbot</Link>
        </Button>
        <Button asChild size="sm" variant={"ghost"} className="text-sm px-2 sm:px-3">
          <Link href="/analytics">Analytics</Link>
        </Button>
        <Button asChild size="sm" variant={"ghost"} className="text-sm px-2 sm:px-3">
          <Link href="/settings">Settings</Link>
        </Button>
      </nav>
      <form action={signOutAction} className="ml-1 sm:ml-2">
        <Button type="submit" variant={"outline"}>
          Sign out
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up">Sign up</Link>
      </Button>
    </div>
  );
}
