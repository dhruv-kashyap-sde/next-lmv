import DarkVeil from "@/components/DarkVeil";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <div className="w-full h-screen absolute top-0 left-0 z-[-1]">
        <DarkVeil hueShift={199} />
      </div>
      <div className="flex h-screen w-full items-center justify-center gap-6">
        <div className="flex h-32 md:h-40 lg:h-48 xl:h-56 2xl:h-64 items-center gap-6">
          <h1 className="font-bebas text-5xl">404 </h1>
          <Separator orientation="vertical" />
          <div className="flex flex-col gap-4">
            <h2 className="text-2xl font-semibold">Page Not Found</h2>
            <p className="text-sm text-zinc-500">
              The page you are looking for does not exist or has been moved.
            </p>
            <Link
              href="/"
              className="text-primary underline underline-offset-4 w-fit"
            >
              Go back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
