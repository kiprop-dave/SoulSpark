/*
  Warnings:

  - You are about to drop the column `basicInfo` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `lifestyle` on the `profiles` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `profiles` table. All the data in the column will be lost.
  - You are about to alter the column `lookingFor` on the `profiles` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(150)`.
  - Added the required column `attraction` to the `profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `diet` to the `profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `drinking` to the `profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `education` to the `profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `first_name` to the `profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maximumAge` to the `profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minimumAge` to the `profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `occupation` to the `profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pets` to the `profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `smoking` to the `profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `socialMediaActivity` to the `profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zodiac` to the `profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "Gender" ADD VALUE 'PreferNotToSay';

-- AlterTable
ALTER TABLE "profiles" DROP COLUMN "basicInfo",
DROP COLUMN "images",
DROP COLUMN "lifestyle",
DROP COLUMN "name",
ADD COLUMN     "attraction" VARCHAR(50) NOT NULL,
ADD COLUMN     "diet" VARCHAR(50) NOT NULL,
ADD COLUMN     "drinking" VARCHAR(50) NOT NULL,
ADD COLUMN     "education" VARCHAR(50) NOT NULL,
ADD COLUMN     "first_name" VARCHAR(50) NOT NULL,
ADD COLUMN     "last_name" VARCHAR(50) NOT NULL,
ADD COLUMN     "maximumAge" INTEGER NOT NULL,
ADD COLUMN     "minimumAge" INTEGER NOT NULL,
ADD COLUMN     "occupation" VARCHAR(50) NOT NULL,
ADD COLUMN     "pets" VARCHAR(50) NOT NULL,
ADD COLUMN     "smoking" VARCHAR(50) NOT NULL,
ADD COLUMN     "socialMediaActivity" VARCHAR(50) NOT NULL,
ADD COLUMN     "zodiac" VARCHAR(50) NOT NULL,
ALTER COLUMN "bio" DROP NOT NULL,
ALTER COLUMN "lookingFor" SET DATA TYPE VARCHAR(150);

-- CreateTable
CREATE TABLE "digital_assets" (
    "id" TEXT NOT NULL,
    "asset_id" TEXT NOT NULL,
    "public_id" TEXT NOT NULL,
    "format" VARCHAR(50) NOT NULL,
    "resource_type" VARCHAR(50) NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url" VARCHAR(255) NOT NULL,
    "secure_url" VARCHAR(255) NOT NULL,
    "profileId" TEXT,

    CONSTRAINT "digital_assets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "digital_assets_asset_id_key" ON "digital_assets"("asset_id");

-- CreateIndex
CREATE UNIQUE INDEX "digital_assets_public_id_key" ON "digital_assets"("public_id");

-- AddForeignKey
ALTER TABLE "digital_assets" ADD CONSTRAINT "digital_assets_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
