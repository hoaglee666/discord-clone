import { ServerSidebar } from "@/components/server/server-sidebar";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

// ✅ Strongly type the props
interface ServerIdLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    serverId: string;
  }>;
}

const ServerIdLayout = async (props: ServerIdLayoutProps) => {
  const params = await props.params;

  const {
    children
  } = props;

  const profile = await currentProfile();

  if (!profile) {
    return <RedirectToSignIn />;
  }

  const serverId = await params.serverId; // No need to await
  const server = await db.server.findUnique({      
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
        }
      }
    }
  });

  if (!server) {
    return redirect("/");
  }

  return (
    <div className="flex h-full">
      <div className="flex-1 overflow-y-auto">
        
        <ServerSidebar serverId={serverId} />
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
};

export default ServerIdLayout;
