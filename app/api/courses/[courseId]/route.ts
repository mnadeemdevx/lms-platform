import Mux from "@mux/mux-node";

import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

const { video } = new Mux({
    tokenId: process.env.MUX_TOKEN_ID!,
    tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string } },
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { courseId } = params;

        const course = await db.course.findUnique({
            where: { id: courseId, userId },
            include: {
                chapters: {
                    include: {
                        muxData: true,
                    },
                },
            },
        });

        if (!course) {
            return new NextResponse("Course not found", { status: 404 });
        }

        for (const chapter of course.chapters) {
            if (chapter.muxData?.assetId) {
                await video.assets.delete(chapter.muxData.assetId);
            }
        }

        const deletedCourse = await db.course.delete({
            where: { id: courseId },
        });

        return NextResponse.json(deletedCourse);
    } catch (err) {
        console.log("[COURSE_ID_DELETE]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string } },
) {
    try {
        const { userId } = auth();
        const { courseId } = params;
        const values = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const course = await db.course.update({
            where: { id: courseId, userId },
            data: { ...values },
        });

        return NextResponse.json(course);
    } catch (err) {
        console.log("[COURSE_ID]", err);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
