-- AlterTable
ALTER TABLE "user" ADD COLUMN     "roles" "UserRole"[];

-- CreateTable
CREATE TABLE "work" (
    "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
    "name" VARCHAR NOT NULL,
    "price" VARCHAR NOT NULL,
    "image" VARCHAR NOT NULL,
    "description" VARCHAR NOT NULL,
    "created_by" UUID NOT NULL,
    "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "work_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "work" ADD CONSTRAINT "work_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
