-- CreateTable
CREATE TABLE "user_device" (
    "id" UUID NOT NULL DEFAULT GEN_RANDOM_UUID(),
    "user_agent" VARCHAR,
    "access_token" VARCHAR NOT NULL,
    "refresh_token" VARCHAR NOT NULL,
    "ip" VARCHAR,
    "user_id" UUID NOT NULL,

    CONSTRAINT "user_device_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "user_device" ADD CONSTRAINT "user_device_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
