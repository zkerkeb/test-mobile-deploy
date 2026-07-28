CREATE TABLE "MealIdea" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "maxMinutes" INTEGER NOT NULL,
  "budget" TEXT NOT NULL,
  "authorName" TEXT,
  "likes" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "MealIdea_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "MealIdea_category_idx" ON "MealIdea"("category");
CREATE INDEX "MealIdea_budget_idx" ON "MealIdea"("budget");
CREATE INDEX "MealIdea_maxMinutes_idx" ON "MealIdea"("maxMinutes");
