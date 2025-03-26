import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  const userId = "reii"; // Replace with a valid Clerk userId (you can get it from Clerk dashboard)

  // 1. Ensure Profile exists
  let profile = await db.profile.findUnique({
    where: { userId },
  });

  if (!profile) {
    profile = await db.profile.create({
      data: {
        userId,
        name: "Test User",
        imageUrl: "https://placekitten.com/200/200",
        email: "test@example.com",
      },
    });
    console.log("Created profile:", profile);
  } else {
    console.log("Profile already exists:", profile);
  }

  // 2. Ensure Server exists and profile is a member
  let server = await db.server.findFirst({
    where: {
      members: {
        some: { profileId: profile.id },
      },
    },
  });

  if (!server) {
    server = await db.server.create({
      data: {
        name: "Test Server",
        imageUrl: "https://placekitten.com/300/300",
        inviteCode: "test-invite-code",
        members: {
          create: {
            profileId: profile.id,
            role: "ADMIN", // or whatever role you have
          },
        },
        channels: {
          create: {
            name: "general",
            type: "TEXT", // Adjust according to your schema
          },
        },
      },
    });
    console.log("Created server:", server);
  } else {
    console.log("Server already exists:", server);
  }
}

main()
  .then(() => {
    console.log("Seeding finished.");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
