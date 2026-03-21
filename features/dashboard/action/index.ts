"use server";
import { currentUser } from "@/features/auth/actions";
import { db } from "@/lib/db";
import { Templates } from "@prisma/client";
import { revalidatePath } from "next/cache";

export const createPlayground = async (data: {
    title: string;
    template: Templates;
    description?: string;
}) => {
    const { template, title, description } = data;
    const user = await currentUser();
    if (!user) {
        throw new Error("You must be logged in to create a playground.");
    }
    try {
        const playground = await db.playground.create({
            data: {
                title,
                description,
                template,
                userId: user.id!,
            }
        })
        return playground;
    } catch (error) {
        console.log("Error creating playground:", error);
        return null;
    }
}

export const getAllPlaygroundForUser = async () => {
    const user = await currentUser();

    try {
        const playgrounds = await db.playground.findMany({
            where: {
                userId: user?.id
            },
            include: {
                user: true,
                Starmark: {
                    where: {
                        userId: user?.id
                    },
                    select: {
                        isMarked: true,
                    }
                }
            }
        })
        return playgrounds;
    } catch (error) {
        console.log("Error fetching playgrounds:", error);
        return null;
    }
}

export const deleteProjectById = async (id: string) => {
    try {
        await db.playground.delete({
            where: { id }
        })
        revalidatePath('/dashboard');
    } catch (error) {
        console.log("Error deleting project:", error);
    }
}

export const editProjectById = async (id: string, data: { title: string, description?: string }) => {
    try {
        await db.playground.update({
            where: { id },
            data: data
        })
        revalidatePath('/dashboard');
    } catch (error) {
        console.log("Error updating project:", error);
    }
}

export const duplicateProjectById = async (id: string) => {
    try {
        const originalPlayground = await db.playground.findUnique({
            where: { id }
        })

        if (!originalPlayground) {
            throw new Error("Original playground not found.");
        }

        const duplicatedPlayground = await db.playground.create({
            data: {
                title: `${originalPlayground.title} (Copy)`,
                description: originalPlayground.description,
                template: originalPlayground.template,
                userId: originalPlayground.userId,
            }
        })

        revalidatePath('/dashboard');
        return duplicatedPlayground;
    } catch (error) {
        console.log("Error duplicating project:", error);
    }
}

export const toggleProjectStar = async (projectId: string) => {
    const user = await currentUser();
    if (!user || !user.id) throw new Error("Unauthorized");

    const existing = await db.starMark.findFirst({
        where: {
            playgroundId: projectId,
            userId: user.id,
        },
    });

    if (existing) {
        await db.starMark.update({
            where: { id: existing.id },
            data: { isMarked: !existing.isMarked },
        });
    } else {
        await db.starMark.create({
            data: {
                playgroundId: projectId,
                userId: user.id,
                isMarked: true,
            },
        });
    }

    revalidatePath("/dashboard");
};