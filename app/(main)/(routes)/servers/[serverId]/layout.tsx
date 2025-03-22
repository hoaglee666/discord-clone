import { ServerSidebar } from "@/components/server/server-sidebar";
import { currentProfile } from "@/lib/crurrent-profile";
import { db } from "@/lib/db";
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
      return redirect("/");
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
      return redirect("/");
    }
  
    return (
      <div className="flex h-full">
        {/* Server Sidebar */}
        <div className="flex-1 overflow-y-auto">
          <ServerSidebar serverId={params.serverId}/>
        </div>
  
        {/* Main content */}
        <div className="flex-1">
          {children}
        </div>
      </div>
    );
  };
  
  export default ServerIdLayout;