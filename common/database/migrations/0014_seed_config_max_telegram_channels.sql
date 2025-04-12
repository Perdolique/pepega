-- Custom SQL migration file that seeds the config table with default values
-- for the maximum number of Telegram channels per user.
DO $$
BEGIN
  INSERT INTO "config" ("key", "value")
  VALUES ('maxTelegramChannelsPerUser', '1')
  ON CONFLICT ("key") DO NOTHING;
END $$;
