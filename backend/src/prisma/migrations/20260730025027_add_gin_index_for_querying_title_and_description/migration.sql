CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- CreateIndex
CREATE INDEX "Album_title_description_idx" ON "Album" USING GIN ("title" gin_trgm_ops, "description" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "Photo_title_description_idx" ON "Photo" USING GIN ("title" gin_trgm_ops, "description" gin_trgm_ops);
