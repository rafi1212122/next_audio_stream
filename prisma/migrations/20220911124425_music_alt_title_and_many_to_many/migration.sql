/*
  Warnings:

  - You are about to drop the column `artistId` on the `Music` table. All the data in the column will be lost.
  - Added the required column `altTitle` to the `Music` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Music" DROP CONSTRAINT "Music_artistId_fkey";

-- AlterTable
ALTER TABLE "Music" DROP COLUMN "artistId",
ADD COLUMN     "altTitle" TEXT NOT NULL,
ADD COLUMN     "streams" BIGINT NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "_ArtistToMusic" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ArtistToMusic_AB_unique" ON "_ArtistToMusic"("A", "B");

-- CreateIndex
CREATE INDEX "_ArtistToMusic_B_index" ON "_ArtistToMusic"("B");

-- AddForeignKey
ALTER TABLE "_ArtistToMusic" ADD CONSTRAINT "_ArtistToMusic_A_fkey" FOREIGN KEY ("A") REFERENCES "Artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArtistToMusic" ADD CONSTRAINT "_ArtistToMusic_B_fkey" FOREIGN KEY ("B") REFERENCES "Music"("id") ON DELETE CASCADE ON UPDATE CASCADE;
