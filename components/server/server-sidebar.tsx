import { currentProfile } from "@/lib/current-profile";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { ServerHeader } from "./server-header";
export enum ChannelType {
    TEXT = "TEXT",
    AUDIO = "AUDIO",
    VIDEO = "VIDEO",
  }
interface ServerSidebarProps {
    serverId: string;
}

export const ServerSidebar = async ({
    serverId    
}: ServerSidebarProps) => {
    const profile = await currentProfile();

    if (!profile) {
        redirect("/");
    }

    const server = await db.server.findUnique({
        where: {
            id: serverId,
        },
        include: {
            channels: {
                orderBy: {
                    createAt: "asc",
                },
            },
            members: {
                include: {
                    profile: true,
                },
                orderBy: {
                    role: "asc",
                }
            }
        }
    });

    const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT);
    const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO);
    const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO);
    const members = server?.members.filter((member) => member.profileId !== profile.id); 
    
    if (!server) {
        return redirect("/");
    }

    const role = server.members.find((member) => member.profileId === profile.id)?.role;
    

    return ( 
        <div className="flex flex-col h-full flex-1 text-primary dark:bg-[#2B2D31] bg-[#f2f3f5]">
            <ServerHeader 
                server={server}
                role={role}
            />
        </div>
     );
}
 