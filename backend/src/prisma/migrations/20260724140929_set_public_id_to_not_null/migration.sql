/*
  Warnings:

  - Made the column `publicId` on table `Photo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `publicId` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Photo" ALTER COLUMN "publicId" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "publicId" SET NOT NULL;
