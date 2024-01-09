-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
    "name" VARCHAR NOT NULL,
    "surname" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "phone" VARCHAR NOT NULL,
    "password" VARCHAR NOT NULL,
    "image" VARCHAR,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);
