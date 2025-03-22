import { initialProfile } from "@/lib/intial-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { InitialModal } from "@/components/modals/initial-modal";

const SetupPage = async () => {
    console.log("SetupPage: Getting profile...");

    const profile = await initialProfile();

    console.log("SetupPage: Profile fetched:", profile);

    if (!profile) {
        console.log("SetupPage: No profile found.");
        return <div>No profile 404 error</div>
    }

    console.log("SetupPage: Checking server...");

    const server = await db.server.findFirst({
        where: {
            members: {
                some: {
                    profileId: profile.id,
                },
            }
        },
    });

    console.log("SetupPage: Server fetched:", server);

    if (server) {
        console.log(`SetupPage: Redirecting to /server/${server.id}`);
        return redirect(`/servers/${server.id}`);
    }

    console.log("SetupPage: No server, showing InitialModal");
    return <InitialModal />;
}

export default SetupPage;