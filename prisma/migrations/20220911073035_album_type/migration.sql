/*
  Warnings:

  - Added the required column `type` to the `Album` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AlbumType" AS ENUM ('SINGLE', 'ALBUM');

-- AlterTable
ALTER TABLE "Album" ADD COLUMN     "type" "AlbumType" NOT NULL;
