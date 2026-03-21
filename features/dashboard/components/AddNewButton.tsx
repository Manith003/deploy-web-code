"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import TemplateSelectionModal from "./TemplateSelectionModal";
import { createPlayground } from "../action";
import { toast } from "sonner";

const AddNewButton = () => {
  const [isModelOpen, setisModelOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<{
    title: string;
    template: "REACT" | "EXPRESSJS" | "NEXTJS" | "VUE" | "ANGULAR";
    description?: string;
  } | null>(null);

  const router = useRouter();

  const handleSubmit = async (data: {
    title: string;
    template: "REACT" | "EXPRESSJS" | "NEXTJS" | "VUE" | "ANGULAR";
    description?: string;
  }) => {
    // Create new project API call
    setSelectedTemplate(data);
    const res = await createPlayground(data);
    toast.success("Playground created successfully!");
    setisModelOpen(false);
    router.push(`/playground/${res?.id}`);
  };
  return (
    <>
      <div
        onClick={() => setisModelOpen(true)}
        className="group px-6 py-8 flex flex-row-reverse justify-between items-center border rounded-lg border-black cursor-pointer 
        transition-all duration-300 ease-in-out
        hover:scale-[1.02] bg-neutral-800 hover:border-white/40 relative overflow-hidden"
      >
        <div className="flex flex-row justify-start items-center gap-4 w-full">
          <div className="buttonClass">
            <Button
              variant={"outline"}
              className="flex justify-center items-center cursor-pointer bg-neutral-700 border-none group-hover:rotate-90 transition-transform duration-300"
              size={"icon"}
            >
              <Plus />
            </Button>
          </div>
          <div className="flex flex-col">
            <h1>Add New</h1>
            <p className="text-sm text-gray-400">Create a new playground</p>
          </div>
        </div>
        <Image
          className="absolute -right-2 border-none scale-90"
          src={"/allprograming.svg"}
          alt="All Programming"
          width={150}
          height={50}
        />
      </div>
      <TemplateSelectionModal
        isOpen={isModelOpen}
        onClose={() => setisModelOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default AddNewButton;
