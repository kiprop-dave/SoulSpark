-- CreateTable
CREATE TABLE "_dislikes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_dislikes_AB_unique" ON "_dislikes"("A", "B");

-- CreateIndex
CREATE INDEX "_dislikes_B_index" ON "_dislikes"("B");

-- AddForeignKey
ALTER TABLE "_dislikes" ADD CONSTRAINT "_dislikes_A_fkey" FOREIGN KEY ("A") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_dislikes" ADD CONSTRAINT "_dislikes_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
