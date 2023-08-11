/*
  Warnings:

  - A unique constraint covering the columns `[messageId]` on the table `digital_assets` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `conversationId` to the `messages` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senderId` to the `messages` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "conversations" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "digital_assets" ADD COLUMN     "messageId" TEXT;

-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "conversationId" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "senderId" TEXT NOT NULL,
ADD COLUMN     "text" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "password" VARCHAR(255);

-- CreateTable
CREATE TABLE "_conversationMembership" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_conversationMembership_AB_unique" ON "_conversationMembership"("A", "B");

-- CreateIndex
CREATE INDEX "_conversationMembership_B_index" ON "_conversationMembership"("B");

-- CreateIndex
CREATE UNIQUE INDEX "digital_assets_messageId_key" ON "digital_assets"("messageId");

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "digital_assets" ADD CONSTRAINT "digital_assets_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_conversationMembership" ADD CONSTRAINT "_conversationMembership_A_fkey" FOREIGN KEY ("A") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_conversationMembership" ADD CONSTRAINT "_conversationMembership_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
