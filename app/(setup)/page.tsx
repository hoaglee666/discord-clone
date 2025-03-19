import { initialProfile } from "@/lib/intial-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { InitialModal } from "@/components/modals/initial-modal";

const SetupPage = async () => {
    const profile = await initialProfile();

    if (!profile) {
        return <div>No profile 404 error</div>
    }

    const server = await db.server.findFirst({
        where: {
            members: {
                some: {
                    profileId: profile.id,
                },
            }
        },
    })

    if (server) {
        return redirect(`/server/${server.id}`);
    }

    return <InitialModal />;
}
 
export default SetupPage;