/*
  Warnings:

  - Added the required column `deleted_at` to the `user_device` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user_device" ADD COLUMN     "deleted_at" TIMESTAMP NOT NULL;
