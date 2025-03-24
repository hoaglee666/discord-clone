import { ServerSidebar } from "@/components/server/server-sidebar";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { serverId: string };
}) => {
  const profile = await currentProfile();

  if (!profile) {
    return <RedirectToSignIn />;
  }

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) {
    // Redirect to setup if no server exists
    return redirect("/setup");
  }

  return (
    <div className="flex h-full">
      {/* Server Sidebar */}
      <div className="flex-1 overflow-y-auto">
        <ServerSidebar serverId={params.serverId} />
      </div>

      {/* Main content */}
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default ServerIdLayout;
