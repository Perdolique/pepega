-- Custom SQL migration file, put your code below! ---- Custom SQL migration file, put your code below! --
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM "oauthProviders" WHERE "type" = 'twitch') THEN
        INSERT INTO "oauthProviders" ("type", "name")
        VALUES ('twitch', 'Twitch');
    END IF;
END $$;
