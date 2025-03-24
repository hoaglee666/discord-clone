import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export const currentProfile = async () => {
    const { userId } = await auth();

    console.log("[currentProfile] userId from Clerk:", userId);

    if (!userId) {
        console.log("[currentProfile] No userId found, returning null.");
        return null;
    }

    const profile = await db.profile.findUnique({
        where: {
            userId,
        },
    });
    

    return profile;
}
