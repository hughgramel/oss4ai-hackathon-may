import NextLogo from "./next-logo";
import SupabaseLogo from "./supabase-logo";
import Link from 'next/link';

export default function Hero() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center px-4 bg-background">
      <div className="max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-foreground mb-6">
          Manage Your AI Projects Seamlessly
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-8">
          The intuitive platform to plan, track, and collaborate on your AI initiatives.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/sign-up" className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
            Get Started
          </Link>
          <Link href="/learn-more" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-base font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}
