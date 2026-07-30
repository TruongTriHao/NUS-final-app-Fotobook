import { faker } from "@faker-js/faker";
import { prisma } from "../lib/prisma.ts";
import { hashPassword } from "../utils/password.ts";

async function main() {
  console.log("🧹 Cleaning database...");
  await prisma.albumLike.deleteMany();
  await prisma.photoLike.deleteMany();
  await prisma.follow.deleteMany();
  await prisma.album.deleteMany();
  await prisma.photo.deleteMany();
  await prisma.user.deleteMany();

  console.log("🌱 Seeding data...");

  const userCount = 100;
  const users = [];

  for (let i = 0; i < userCount; i++) {
    const firstName = faker.person.firstName().slice(0, 25);
    const lastName = faker.person.lastName().slice(0, 25);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email: faker.internet
          .email({ firstName, lastName })
          .toLowerCase()
          .slice(0, 255),
        password: await hashPassword("password"),
        avatarUrl: faker.helpers.maybe(() => faker.image.avatar(), {
          probability: 0.8,
        }),
        role: faker.helpers.arrayElement(["user", "admin"]),
        lastLogin: faker.helpers.maybe(() => faker.date.recent(), {
          probability: 0.7,
        }),
        isActive: faker.datatype.boolean(0.9),
        isVerified: faker.datatype.boolean(0.8),
      },
    });
    users.push(user);
  }
  console.log(`✅ Created ${users.length} users.`);

  const photos = [];
  const albums = [];

  for (const user of users) {
    const photoCount = faker.number.int({ min: 1, max: 5 });
    for (let j = 0; j < photoCount; j++) {
      const createdAt = faker.date.past({ years: 1 });
      const updatedAt = faker.date.between({ from: createdAt, to: new Date() });

      const photo = await prisma.photo.create({
        data: {
          title: faker.lorem.sentence().slice(0, 140),
          description: faker.lorem.paragraph().slice(0, 300),
          imageUrl: faker.image.url({ category: "nature" }),
          mode: faker.helpers.arrayElement(["public", "private"]),
          ownerId: user.id,
          createdAt,
          updatedAt,
        },
      });
      photos.push(photo);
    }

    const albumCount = faker.number.int({ min: 1, max: 3 });
    for (let k = 0; k < albumCount; k++) {
      const createdAt = faker.date.past({ years: 1 });
      const updatedAt = faker.date.between({ from: createdAt, to: new Date() });

      const album = await prisma.album.create({
        data: {
          title: faker.lorem.sentence().slice(0, 140),
          description: faker.lorem.paragraph().slice(0, 300),
          mode: faker.helpers.arrayElement(["public", "private"]),
          ownerId: user.id,
          images: Array.from(
            { length: faker.number.int({ min: 2, max: 6 }) },
            () => faker.image.url({ category: "travel" }),
          ),
          createdAt,
          updatedAt,
        },
      });
      albums.push(album);
    }
  }
  console.log(
    `✅ Created ${photos.length} photos and ${albums.length} albums.`,
  );

  let followCount = 0;
  for (const follower of users) {
    const followees = faker.helpers.arrayElements(
      users.filter((u) => u.id !== follower.id),
      faker.number.int({ min: 0, max: 5 }),
    );

    for (const followee of followees) {
      await prisma.follow.create({
        data: {
          followerId: follower.id,
          followeeId: followee.id,
        },
      });
      followCount++;
    }
  }
  console.log(`✅ Created ${followCount} follow relationships.`);

  let photoLikeCount = 0;
  let albumLikeCount = 0;

  for (const user of users) {
    const likedPhotos = faker.helpers.arrayElements(
      photos,
      faker.number.int({ min: 0, max: 10 }),
    );
    for (const photo of likedPhotos) {
      await prisma.photoLike.create({
        data: {
          userId: user.id,
          photoId: photo.id,
        },
      });
      photoLikeCount++;
    }

    const likedAlbums = faker.helpers.arrayElements(
      albums,
      faker.number.int({ min: 0, max: 5 }),
    );
    for (const album of likedAlbums) {
      await prisma.albumLike.create({
        data: {
          userId: user.id,
          albumId: album.id,
        },
      });
      albumLikeCount++;
    }
  }
  console.log(
    `✅ Created ${photoLikeCount} photo likes and ${albumLikeCount} album likes.`,
  );
  console.log("🚀 Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
