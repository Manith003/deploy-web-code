import EmptyState from "@/components/ui/EmptyState";
import { deleteProjectById, duplicateProjectById, editProjectById, getAllPlaygroundForUser, toggleProjectStar } from "@/features/dashboard/action";
import AddNewButton from "@/features/dashboard/components/AddNewButton";
import ProjectTable from "@/features/dashboard/components/ProjecTable";

const Page = async () => {
  const playgrounds = await getAllPlaygroundForUser();
  return (
    <div className="bg-neutral-900 text-white min-h-screen flex flex-col justify-start items-center px-4 py-10">
      <div className="grid grid-cols-1 md:grid-cols-1 gap-6 w-full px-4">
        <AddNewButton />
        {/* <AddRepoButton /> */}
      </div>

      <div className="mt-10 flex flex-col justify-center items-center w-full">
        {playgrounds && playgrounds.length === 0 ? (
          <EmptyState
            title="No Playgrounds"
            description="You have not created any playgrounds yet."
            imgSrc="/empty.svg"
          />
        ) : (
          <ProjectTable 
          // @ts-expect-error-ignore
          //need to fix this ts-ignore later
          projects = {playgrounds || []}
          onDeleteProject={deleteProjectById}
          onUpdateProject={editProjectById}
          onDuplicateProject={duplicateProjectById}
          onToggleStar={toggleProjectStar}
          />
        )}
      </div>
    </div>
  );
};

export default Page;
