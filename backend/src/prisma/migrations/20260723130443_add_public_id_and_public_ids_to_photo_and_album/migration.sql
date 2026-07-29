/*
  Warnings:

  - A unique constraint covering the columns `[publicId]` on the table `Photo` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Album" ADD COLUMN     "publicIds" TEXT[];

-- AlterTable
ALTER TABLE "Photo" ADD COLUMN     "publicId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Photo_publicId_key" ON "Photo"("publicId");
