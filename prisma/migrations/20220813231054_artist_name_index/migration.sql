/*
  Warnings:

  - You are about to drop the column `name` on the `Artist` table. All the data in the column will be lost.
  - Added the required column `names` to the `Artist` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Artist" DROP COLUMN "name",
ADD COLUMN     "names" JSONB NOT NULL;

-- CreateIndex
CREATE INDEX "Artist_names_idx" ON "Artist" USING GIN ("names" jsonb_path_ops);
