import { currentProfile } from "@/lib/crurrent-profile";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
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
            id: serverId
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
    
    return ( 
        <div>
            Server Sidebar Component
        </div>
     );
}
 