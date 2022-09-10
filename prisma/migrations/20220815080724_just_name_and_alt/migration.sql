/*
  Warnings:

  - You are about to drop the column `names` on the `Artist` table. All the data in the column will be lost.
  - Added the required column `altName` to the `Artist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Artist` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Artist_names_idx";

-- AlterTable
ALTER TABLE "Artist" DROP COLUMN "names",
ADD COLUMN     "altName" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;
