/*
  Warnings:

  - The `correctudeTxt` column on the `UserChallenge` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `completudeTxt` column on the `UserChallenge` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `clareteTxt` column on the `UserChallenge` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `profondeurTxt` column on the `UserChallenge` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "UserChallenge" DROP COLUMN "correctudeTxt",
ADD COLUMN     "correctudeTxt" TEXT[],
DROP COLUMN "completudeTxt",
ADD COLUMN     "completudeTxt" TEXT[],
DROP COLUMN "clareteTxt",
ADD COLUMN     "clareteTxt" TEXT[],
DROP COLUMN "profondeurTxt",
ADD COLUMN     "profondeurTxt" TEXT[];
