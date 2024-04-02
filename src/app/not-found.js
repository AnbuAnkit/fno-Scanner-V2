import Link from "next/link";

export default function Component() {
  return (
    <div className="flex flex-col min-h-[100vh] items-center justify-center space-y-4">
      <div className="space-y-2 text-center">
        <FileIcon className="mx-auto h-20 w-20" />
        <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
          Uh oh! This page doesn't exist.
        </h1>
        <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed dark:text-gray-400">
          You've hit a route that doesn't exist. The good news is, you can
          always go back to the homepage.
        </p>
      </div>
      <Link
        className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200  bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
        href="/"
      >
        Go to the homepage
      </Link>
    </div>
  );
}

function FileIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}
