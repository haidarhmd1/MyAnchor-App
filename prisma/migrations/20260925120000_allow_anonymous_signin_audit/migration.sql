-- Failed sign-in attempts do not have a User row yet. Allow those audit rows
-- to be stored without inventing a foreign-key value such as "anon".
ALTER TABLE "SignInAudit" ALTER COLUMN "userId" DROP NOT NULL;
