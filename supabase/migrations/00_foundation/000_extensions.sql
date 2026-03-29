-- 000_extensions.sql
-- Must run before all other foundation migrations.
-- Supabase hosted projects include these by default.
-- Required explicitly for local dev (supabase start) and self-hosted.

-- pgcrypto: required for crypt() in auth.verify_nfc_pin() (003_auth_functions.sql)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- uuid-ossp: gen_random_uuid() is built into PG14+, but uuid_generate_v4() needs this
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
