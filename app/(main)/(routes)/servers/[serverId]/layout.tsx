import { ServerSidebar } from "@/components/server/server-sidebar";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

// ✅ Strongly type the props
interface ServerIdLayoutProps {
  children: React.ReactNode;
  params: {
    serverId: string;
  };
}

const ServerIdLayout = async ({ children, params }: ServerIdLayoutProps) => {
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
    return redirect("/");
  }

  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-y-auto">
        <ServerSidebar serverId={params.serverId} />
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default ServerIdLayout;
