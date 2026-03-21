"use client";
import Image from "next/image";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { useState } from "react";
import {
  MoreHorizontal,
  Edit3,
  Trash2,
  ExternalLink,
  Copy,
  Download,
  Eye,
} from "lucide-react";
import { toast } from "sonner";
import { Project } from "../types";
import MarkedToggleButton from "./MarkedToggleButton";

interface ProjectTableProps {
  projects: Project[];
  onDeleteProject?: (projectId: string) => void;
  onUpdateProject?: (
    projectId: string,
    data: { title: string; description?: string }
  ) => void;
  onDuplicateProject?: (projectId: string) => void;
  onToggleStar: (projectId: string) => Promise<void>;
}

interface EditProjectData {
  title: string;
  description?: string;
}

export default function ProjectTable({
  projects,
  onDeleteProject,
  onUpdateProject,
  onDuplicateProject,
  onToggleStar,
}: ProjectTableProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [editData, setEditData] = useState<EditProjectData>({
    title: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  //handle duplicate project
  const handleDuplicateProject = async (project: Project) => {
    if (!onDuplicateProject) return;
    setIsLoading(true);
    try {
      await onDuplicateProject(project.id);
      toast.success("Project duplicated successfully");
    } catch (error) {
      toast.error("Failed to duplicate project");
      console.error("Duplicate project error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  //help to open the edit modal
  const handleEditClick = async (project: Project) => {
    setSelectedProject(project);
    setEditData({
      title: project.title,
      description: project.description || "",
    });
    setEditDialogOpen(true);
  };

  //actual logic for update project
  const handleUpdateProject = async () => {
    if (!selectedProject || !onUpdateProject) return;
    setIsLoading(true);
    try {
      await onUpdateProject(selectedProject.id, editData);
      setEditDialogOpen(false);
      setSelectedProject(null);
      toast.success("Project updated successfully");
    } catch (error) {
      toast.error("Failed to update project");
      console.error("Update project error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  //handle delete project
  const handleDeleteClick = async (project: Project) => {
    setSelectedProject(project);
    setDeleteDialogOpen(true);
  };

  //actual logic for delete project
  const handleDeleteProject = async () => {
    if (!selectedProject || !onDeleteProject) return;
    setIsLoading(true);
    try {
      await onDeleteProject(selectedProject.id);
      setDeleteDialogOpen(false);
      setSelectedProject(null);
      toast.success("Project deleted successfully");
    } catch (error) {
      toast.error("Failed to delete project");
      console.error("Delete project error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  //copy project url to clipboard
  const copyProjectUrl = async (projectId: string) => {
    const projectUrl = `${window.location.origin}/playground/${projectId}`;
    try {
      await navigator.clipboard.writeText(projectUrl);
      toast.success("Project URL copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy URL");
      console.error("Copy URL error:", error);
    }
  };
  return (
    <>
      <div className="border rounded-lg overflow-hidden min-w-[96%]">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-800 hover:bg-neutral-800">
              <TableHead className="text-white">Project</TableHead>
              <TableHead className="text-white">Template</TableHead>
              <TableHead className="text-white">Created</TableHead>
              <TableHead className="text-white">User</TableHead>
              <TableHead className="w-[50px] text-white">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                {/* tablecell1 */}
                <TableCell>
                  <div className="flex flex-col">
                    <Link
                      href={`/playground/${project.id}`}
                      className="hover:underline"
                    >
                      <span className="font-semibold">{project.title} </span>
                    </Link>
                    <span className="text-white/60">{project.description}</span>
                  </div>
                </TableCell>
                {/* tablecell2 */}
                <TableCell>
                  <Badge variant={"outline"} className="capitalize text-white">
                    {project.template}
                  </Badge>
                </TableCell>
                {/* tablecell3 */}
                <TableCell>
                  {format(new Date(project.createdAt), "MMM d, yyyy")}
                </TableCell>
                {/* tablecell4 */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full overflow-hidden">
                      <Image
                        src={project.user.image}
                        alt={project.user.name}
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                    <span>{project.user.name}</span>
                  </div>
                </TableCell>
                {/* tablecell5 */}
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem
                        onClick={() => onToggleStar(project.id)}
                        className="flex items-center"
                      >
                        <MarkedToggleButton
                          markedForRevision={project.Starmark[0]?.isMarked}
                        />
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/playground/${project.id}`}
                          className="flex items-center"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Open Project
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link
                          href={`/playground/${project.id}`}
                          target="_blank"
                          className="flex items-center"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open in New Tab
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleEditClick(project)}
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit Project
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDuplicateProject(project)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => copyProjectUrl(project.id)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Copy URL
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteClick(project)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Project
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Modify the project details below.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="project-title" className="mb-2">
                Project Title
              </Label>
              <Input
                id="project-title"
                value={editData.title}
                onChange={(e) =>
                  setEditData({ ...editData, title: e.target.value })
                }
                placeholder="Project Title"
              />
            </div>
            <div>
              <Label htmlFor="project-description" className="mb-2">
                Project Description
              </Label>
              <Textarea
                id="project-description"
                value={editData.description}
                onChange={(e) =>
                  setEditData({ ...editData, description: e.target.value })
                }
                placeholder="Project Description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant={"ghost"}
              className="cursor-pointer"
              onClick={() => setEditDialogOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-800 hover:bg-blue-900 cursor-pointer"
              onClick={handleUpdateProject}
            >
              {isLoading ? "Updating..." : "Update Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Project</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete your project{" "}
              {<span className="text-red-500">{selectedProject?.title}?</span>}{" "}
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel className="cursor-pointer">
              cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 cursor-pointer"
              onClick={handleDeleteProject}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
