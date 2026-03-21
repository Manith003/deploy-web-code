import { ArrowUpRight, CodeXmlIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Codes,
  CodeHeader,
  CodeBlock,
} from "@/components/animate-ui/components/animate/code";
import Image from "next/image";

export default function Home() {
  return (
    <div className="z-20 flex items-center justify-between min-h-screen gap-2 sm:px-6">
      <div className="left flex flex-col justify-center my-5 w-1/2 gap-8">
        <Badge
          variant="secondary"
          className="bg-blue-600 text-white dark:bg-emerald-600"
        >
          <CodeXmlIcon className="animate-pulse" />
          No setup, Just coding
        </Badge>
        <h1 className="text-7xl font-bold text-left text-white leading-tighter">
          AI Powered Web IDE That Runs Entirely in Your Browser.
        </h1>
        <div>
          <Link href={"/dashboard"} className="w-fit">
            <Button variant={"secondary"} className="cursor-pointer">
              Launch Web.code IDE
              <ArrowUpRight />
            </Button>
          </Link>
        </div>
      </div>
      <div className="right max-w-1/2 flex flex-col justify-center items-center my-5">
        <Codes
          code={`import React from "react";

type WelcomeProps = {
  name?: string;
};

function Welcome({ name = "Developer" }: WelcomeProps) {
  return (
    <div>
      <h1>Welcome to Web.Code IDE</h1>
      <p>Hello {name}, your coding environment is ready.</p>
      <p>Start building amazing things right here in your browser.</p>
    </div>
  );
}

export { Welcome, type WelcomeProps };
`}
        >
          <CodeHeader copyButton>
            <Image
              src="./react.svg"
              alt="final-year-project"
              width={20}
              height={20}
            />
            final-year-project.tsx
          </CodeHeader>
          <CodeBlock lang="ts" />
        </Codes>
      </div>
    </div>
  );
}
