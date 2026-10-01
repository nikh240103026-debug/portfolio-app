DO $$
BEGIN
  IF to_regclass('"ContactMessage"') IS NULL THEN
    CREATE TABLE "ContactMessage" (
      "id" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "email" TEXT NOT NULL,
      "inquiryType" TEXT NOT NULL DEFAULT 'General inquiry',
      "subject" TEXT NOT NULL,
      "message" TEXT NOT NULL,
      "organization" TEXT,
      "budgetRange" TEXT,
      "timeline" TEXT,
      "responseText" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "respondedAt" TIMESTAMP(3),
      "status" TEXT NOT NULL DEFAULT 'new',
      CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
    );
  ELSE
    ALTER TABLE "ContactMessage"
      ADD COLUMN IF NOT EXISTS "inquiryType" TEXT NOT NULL DEFAULT 'General inquiry',
      ADD COLUMN IF NOT EXISTS "organization" TEXT,
      ADD COLUMN IF NOT EXISTS "budgetRange" TEXT,
      ADD COLUMN IF NOT EXISTS "timeline" TEXT,
      ADD COLUMN IF NOT EXISTS "responseText" TEXT,
      ADD COLUMN IF NOT EXISTS "respondedAt" TIMESTAMP(3),
      ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'new';
  END IF;
END $$;