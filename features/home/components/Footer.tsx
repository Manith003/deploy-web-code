export default function Footer() {
  return (
    <footer>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex flex-col items-center space-y-6 text-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          &copy; {new Date().getFullYear()} web.code IDE. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
