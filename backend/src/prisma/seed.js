import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { prisma } from "../lib/prisma";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function seed(path, tableName, transformData = null) {
  const filePath = join(__dirname, path);
  let jsonData = JSON.parse(readFileSync(filePath, "utf8"));

  if (transformData) {
    jsonData = transformData(jsonData);
  }

  try {
    const result = await prisma[tableName].createMany({
      data: jsonData,
      skipDuplicates: true,
    });
    console.log(`Successfully inserted ${result.count} records!`);
  } catch (error) {
    console.error("Error inserting data:", error);
  }
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
