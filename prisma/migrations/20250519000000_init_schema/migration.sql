-- CreateTable
CREATE TABLE "favorites" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "recipe_name" TEXT NOT NULL,
    "recipe_data" JSONB NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "favorites_user_id_idx" ON "favorites"("user_id");
