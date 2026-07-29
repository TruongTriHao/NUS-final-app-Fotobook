/*
  Warnings:

  - You are about to drop the column `publicIds` on the `Album` table. All the data in the column will be lost.
  - You are about to drop the column `publicId` on the `Photo` table. All the data in the column will be lost.
  - You are about to drop the column `publicId` on the `User` table. All the data in the column will be lost.
  - Added the required column `imageUrl` to the `Photo` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Photo_publicId_key";

-- DropIndex
DROP INDEX "User_publicId_key";

-- AlterTable
ALTER TABLE "Album" DROP COLUMN "publicIds",
ADD COLUMN     "images" TEXT[];

-- AlterTable
ALTER TABLE "Photo" DROP COLUMN "publicId",
ADD COLUMN     "imageUrl" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "publicId",
ADD COLUMN     "avatarUrl" TEXT;
