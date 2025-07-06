-- Custom SQL migration file that adds new notification providers.
DO $$
BEGIN
  INSERT INTO "notificationProviders" ("name", "type")
  VALUES ('Telegram', 'telegram')
  ON CONFLICT ("type") DO NOTHING;
END $$;
