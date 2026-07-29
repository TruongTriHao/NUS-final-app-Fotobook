import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { prisma } from "../lib/prisma";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prismaModels = {
  User: prisma.user,
  Photo: prisma.photo,
  Album: prisma.album,
  Follow: prisma.follow,
  PhotoLike: prisma.photoLike,
  AlbumLike: prisma.albumLike,
};

async function seed(path, tableName, transformData = null) {
  const filePath = join(__dirname, path);
  let jsonData = JSON.parse(readFileSync(filePath, "utf8"));

  if (transformData) {
    jsonData = transformData(jsonData);
  }

  const model = prismaModels[tableName];
  if (!model) {
    throw new Error(`Model for table ${tableName} not found.`);
  }
  const result = await model.createMany({
    data: jsonData,
    skipDuplicates: true,
  });
  console.log(`Successfully inserted ${result.count} records!`);
}

async function main() {
  try {
    await seed("mocks/User.json", "User", (users) =>
      users.map((user) => ({ ...user, isVerified: true })),
    );
    await seed("mocks/Photo.json", "Photo");
    await seed("mocks/Album.json", "Album");
    await seed("mocks/Follow.json", "Follow");
    await seed("mocks/PhotoLike.json", "PhotoLike");
    await seed("mocks/AlbumLike.json", "AlbumLike");
  } catch (error) {
    console.error("Seed process failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
