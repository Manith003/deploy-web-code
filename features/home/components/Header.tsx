import Link from "next/link";
import UserButton from "@/features/auth/components/UserButton";

const Header = () => {
  return (
    <div className="sticky top-0 left-0 right-0 z-50 px-4">
      <div className="bg-transparent dark:black/50 w-full">
        <div className="flex items-center justify-center flex-col w-full">
          <div
            className="
                            flex items-center justify-between
                            w-full
                            max-w-7xl
                            mx-auto
                            px-4
                            sm:px-6
                            h-16
                            
                        "
          >
            <div className="relative z-10 flex items-center justify-between w-full gap-2">
              <div className="flex items-center gap-6 justify-center">
                <Link
                  href="/"
                  className="flex items-center gap-2 justify-center"
                >
                  <h1 className="text-white font-sans text-2xl">WEB.CODE</h1>
                </Link>
                <span className="text-zinc-300 dark:text-zinc-700">|</span>
                <div className="hidden sm:flex items-center gap-4">
                  <Link
                    href="/"
                    className="text-sm text-zinc-100 hover:text-zinc-400 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                  >
                    Docs
                     <span className="text-green-500 dark:text-green-400 border border-green-500 dark:border-green-400 rounded-lg px-2 py-0.5 text-xs ml-2">
                      New
                    </span>
                  </Link>
                  {/* <Link
                                            href="/pricing"
                                            className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                                        >
                                            Pricing
                                        </Link> */}
                </div>
              </div>

              {/* Right side items */}
              <div className="hidden sm:flex items-center gap-3">
                {/* <span className="text-zinc-300 dark:text-zinc-700">|</span> */}
                <UserButton />
              </div>

              {/* Mobile Navigation remains unchanged */}
              <div className="flex sm:hidden items-center gap-4">
                <Link
                  href="/"
                  className="text-sm text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100 transition-colors"
                >
                  Docs
                </Link>
                {/* <ThemeToggle /> */}
                <UserButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
