import { currentProfile } from "@/lib/crurrent-profile"
import { redirect } from "next/navigation"

import { db } from "@/lib/db"


import { NavigationAction } from "./navigation-action"
import { Separator } from "../ui/separator"
import { ScrollArea } from "../ui/scroll-area"
import { NavigationItem } from "./navigation-item"
import { ModeToggle } from "../mode-toggle"
import { UserButton } from "@clerk/nextjs"

export const NavigationSidebar = async () =>  {
    const profile = await currentProfile();

    if (!profile)  {
        return redirect("/");
    }

    const servers = await db.server.findMany({
        where: {
            members: {
                some: {
                    profileId: profile.id
                }
            }
        }
    });

    return (
        <div
            className="h-full text-primary w-[72px] 
            dark:bg-[#1b1c2a] py-3 space-y-4 
            flex flex-col items-center"
        >
            <NavigationAction />
            <Separator className="h-[2px] bg-zinc-300 dark:bg-zinc-700 rounded-md"/>
            <ScrollArea className="flex-1 w-full">
                {servers.map((server) => (
                    <div key={server.id} className="mb-4">
                        <NavigationItem 
                            id={server.id}
                            name={server.name}
                            imageUrl={server.imageUrl}
                        />
                    </div>
                ))}
            </ScrollArea>
            <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
                <ModeToggle />
                <UserButton 
                    afterSignOutUrl="/"
                    appearance={{
                        elements: {
                            avatarBox: "h-[48px] w-[48px]"
                        }
                    }}
                />

            </div>
        </div>
    );
};
