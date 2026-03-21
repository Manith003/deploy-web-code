"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import {
  ChevronRight,
  Search,
  Star,
  Code,
  Server,
  Globe,
  Zap,
  Clock,
  Check,
  Plus,
} from "lucide-react";

import Image from "next/image";
import { useState } from "react";

type TemplateSelectionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    template: "REACT" | "EXPRESSJS" | "NEXTJS" | "VUE" | "ANGULAR";
    description?: string;
  }) => void;
};

interface TemplateOption {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  popularity: number;
  tags: string[];
  features: string[];
  category: "Frontend" | "Backend" | "Fullstack";
}

const templates: TemplateOption[] = [
  {
    id: "react",
    name: "React",
    description:
      "A JavaScript library for building fast and interactive user interfaces.",
    icon: "/react.svg",
    color: "bg-blue-500",
    popularity: 5,
    tags: ["JavaScript", "UI", "SPA"],
    features: ["Component-Based", "Virtual DOM", "JSX", "Hooks"],
    category: "Frontend",
  },
  {
    id: "expressjs",
    name: "Express.js",
    description:
      "A minimal and flexible Node.js framework for building web APIs and servers.",
    icon: "/expressjs2.svg",
    color: "bg-gray-700",
    popularity: 4,
    tags: ["Node.js", "API", "Backend"],
    features: ["Middleware", "Routing", "REST APIs", "Fast Setup"],
    category: "Backend",
  },
  {
    id: "vue",
    name: "Vue.js",
    description:
      "A progressive JavaScript framework for building modern user interfaces.",
    icon: "/vue.svg",
    color: "bg-emerald-500",
    popularity: 4,
    tags: ["JavaScript", "UI", "SPA"],
    features: [
      "Reactive Data",
      "Component-Based",
      "Virtual DOM",
      "Single File Components",
    ],
    category: "Frontend",
  },
  {
    id: "angular",
    name: "Angular",
    description:
      "A full-featured frontend framework for building scalable web applications.",
    icon: "/angular.svg",
    color: "bg-red-600",
    popularity: 4,
    tags: ["TypeScript", "Framework", "SPA"],
    features: [
      "Two-Way Binding",
      "Dependency Injection",
      "RxJS",
      "MVC Architecture",
    ],
    category: "Frontend",
  },
  {
    id: "nextjs",
    name: "Next.js",
    description:
      "A React framework for building full-stack applications with SSR and SSG.",
    icon: "/next3.svg",
    color: "bg-black",
    popularity: 5,
    tags: ["React", "SSR", "SEO"],
    features: [
      "Server Components",
      "File-based Routing",
      "API Routes",
      "Static Generation",
    ],
    category: "Fullstack",
  },
];

const TemplateSelectionModal = ({
  isOpen,
  onClose,
  onSubmit,
}: TemplateSelectionModalProps) => {
  const [step, setStep] = useState<"select" | "configure">("select");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [category, setCategory] = useState<
    "All" | "Frontend" | "Backend" | "Fullstack"
  >("All");
  const [projectName, setProjectName] = useState<string>("");

  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      category === "All" || template.category === category;
    return matchesSearch && matchesCategory;
  });

  const handleSelectedTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleContinue = () => {
    if (selectedTemplate) {
      setStep("configure");
    }
  };

  const renderStars = (count: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => {
        return (
          <Star
            key={i}
            size={14}
            className={
              i < count ? " fill-yellow-400 text-yellow-400" : "text-gray-300"
            }
          />
        );
      });
  };

  const handleBack = () => {
    setStep("select");
  };
  const handleCreateProject = () => {
    if (selectedTemplate) {
      const templateMap: Record<
        string,
        "REACT" | "EXPRESSJS" | "NEXTJS" | "VUE" | "ANGULAR"
      > = {
        react: "REACT",
        expressjs: "EXPRESSJS",
        nextjs: "NEXTJS",
        vue: "VUE",
        angular: "ANGULAR",
      };
      const template = templates.find((t)=> t.id === selectedTemplate);
      onSubmit({
        title: projectName || template?.name || "New Project",
        template: templateMap[selectedTemplate],
        description: template?.description,
      })
    }

    // Reset modal state for next open
    onClose();
    setStep("select");
    setSelectedTemplate(null);
    setProjectName("");
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          setStep("select");
          setSelectedTemplate(null);
          setProjectName("");
        }
      }}
    >
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto lg:max-w-5xl bg-neutral-800 text-white">
        {step === "select" ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Plus className="inline mb-1 mr-2" />
                Select a Template
              </DialogTitle>
              <DialogDescription>
                Choose a template to kickstart your new project.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-6 py-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 outline-none"
                    size={18}
                  />
                  <Input
                    placeholder="Search Template"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Tabs
                  defaultValue="All"
                  className="w-full sm:w-auto"
                  onValueChange={(value) => setCategory(value as any)}
                >
                  <TabsList className="grid grid-cols-4 w-full sm:w-[400px] bg-neutral-700 ">
                    <TabsTrigger value="All" className="">
                      All
                    </TabsTrigger>
                    <TabsTrigger value="Frontend">Frontend</TabsTrigger>
                    <TabsTrigger value="Backend">Backend</TabsTrigger>
                    <TabsTrigger value="Fullstack">Fullstack</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <RadioGroup
                value={selectedTemplate || ""}
                onValueChange={handleSelectedTemplate}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredTemplates.length > 0 ? (
                    filteredTemplates.map((template) => (
                      <div
                        key={template.id}
                        className={`relative flex p-6  rounded-lg cursor-pointer
                          transition-all duration-300 hover:scale-[1.02] hover:border bg-neutral-700 
                          `}
                        onClick={() => handleSelectedTemplate(template.id)}
                      >
                        <div className="absolute top-4 right-4 flex gap-1">
                          {renderStars(template.popularity)}
                        </div>

                        {selectedTemplate === template.id && (
                          <div className="absolute top-2 left-2 bg-[#ffffff] text-black rounded-full p-1">
                            <Check size={14} />
                          </div>
                        )}

                        <div className="flex gap-4">
                          <div
                            className="relative w-16 h-16 shrink-0 flex items-center justify-center rounded-full"
                            style={{ backgroundColor: `${template.color}15` }}
                          >
                            <Image
                              src={template.icon || "/placeholder.svg"}
                              alt={`${template.name} icon`}
                              width={40}
                              height={40}
                              className="object-contain"
                            />
                          </div>

                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-semibold">
                                {template.name}
                              </h3>
                              <div className="flex gap-1">
                                {template.category === "Frontend" && (
                                  <Code size={14} className="text-blue-500" />
                                )}
                                {template.category === "Backend" && (
                                  <Server
                                    size={14}
                                    className="text-green-500"
                                  />
                                )}
                                {template.category === "Fullstack" && (
                                  <Globe
                                    size={14}
                                    className="text-purple-500"
                                  />
                                )}
                              </div>
                            </div>

                            <p className="text-sm text-muted-foreground mb-3">
                              {template.description}
                            </p>

                            <div className="flex flex-wrap gap-2 mt-auto">
                              {template.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-xs px-2 py-1 border rounded-2xl"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <RadioGroupItem
                          value={template.id}
                          id={template.id}
                          className="sr-only"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-2 flex flex-col items-center justify-center p-8 text-center">
                      <Search size={48} className="mb-4 text-gray-400" />
                      <h3 className="text-lg font-semibold">
                        Sorry, we dont have any template matching {searchQuery}
                      </h3>
                    </div>
                  )}
                </div>
              </RadioGroup>

              <div className="flex justify-between gap-3 mt-4 pt-4 border-t">
                <div className="flex items-center text-sm">
                  <Clock size={14} className="mr-2" />
                  <span>
                    Estimated setup time:
                    {selectedTemplate
                      ? " 2-5min"
                      : " select a template to estimate"}
                  </span>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant={"ghost"}
                    onClick={onClose}
                    className="cursor-pointer"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant={"secondary"}
                    onClick={handleContinue}
                    disabled={!selectedTemplate}
                    className="cursor-pointer bg-blue-800 text-white hover:bg-blue-900"
                  >
                    Continue <ChevronRight size={14} className="ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                Configure Your Project
              </DialogTitle>
              <DialogDescription>
                {templates.find((t) => t.id === selectedTemplate)?.name} project
                setup.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-6 py-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  placeholder="Enter your project name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>

              <div className="p-4 rounded-lg border">
                <h3 className="font-medium mb-2">Selected Template Features</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {templates
                    .find((t) => t.id === selectedTemplate)
                    ?.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <Zap size={16} className="text-yellow-400" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="flex justify-between gap-3 mt-4 pt-4 border-t">
                <Button
                  variant={"ghost"}
                  onClick={handleBack}
                  className="cursor-pointer"
                >
                  Back
                </Button>
                <Button
                  onClick={handleCreateProject}
                  className="cursor-pointer bg-blue-800 hover:bg-blue-900"
                >
                  Create Project
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TemplateSelectionModal;
