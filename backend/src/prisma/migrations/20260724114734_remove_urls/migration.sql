/*
  Warnings:

  - You are about to drop the column `images` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the column `avatarUrl` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Album" DROP COLUMN "images";

-- AlterTable
ALTER TABLE "Photo" DROP COLUMN "imageUrl";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatarUrl";
