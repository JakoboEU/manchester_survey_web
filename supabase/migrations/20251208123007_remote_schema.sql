


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";





SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."demographics" (
    "demographic" character varying(10) NOT NULL,
    "demographic_value" character varying(10) NOT NULL
);


ALTER TABLE "public"."demographics" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."habitat" (
    "demographic" character varying(10) NOT NULL,
    "demographic_value" character varying(10) NOT NULL,
    "habitat_id" integer NOT NULL,
    "mu" numeric DEFAULT 1500.0 NOT NULL,
    "rankings" bigint DEFAULT 0
);


ALTER TABLE "public"."habitat" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."person" (
    "person_id" "uuid" NOT NULL,
    "rankings" bigint DEFAULT 0
);


ALTER TABLE "public"."person" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."person_demographics" (
    "person_id" "uuid",
    "demographic" character varying(10) NOT NULL,
    "demographic_value" character varying(10) NOT NULL
);


ALTER TABLE "public"."person_demographics" OWNER TO "postgres";


ALTER TABLE ONLY "public"."demographics"
    ADD CONSTRAINT "demographics_pk" PRIMARY KEY ("demographic", "demographic_value");



ALTER TABLE ONLY "public"."person"
    ADD CONSTRAINT "person_pkey" PRIMARY KEY ("person_id");



ALTER TABLE ONLY "public"."habitat"
    ADD CONSTRAINT "habitat_to_demographics_fk" FOREIGN KEY ("demographic", "demographic_value") REFERENCES "public"."demographics"("demographic", "demographic_value");



ALTER TABLE ONLY "public"."person_demographics"
    ADD CONSTRAINT "person_demographics_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "public"."person"("person_id");



ALTER TABLE ONLY "public"."person_demographics"
    ADD CONSTRAINT "person_to_demographics_fk" FOREIGN KEY ("demographic", "demographic_value") REFERENCES "public"."demographics"("demographic", "demographic_value");



CREATE POLICY "Anonymous users can insert person." ON "public"."person" FOR INSERT WITH CHECK ((("auth"."role"() = 'authenticated'::"text") AND (("auth"."jwt"() ->> 'is_anonymous'::"text") = 'true'::"text")));



CREATE POLICY "Anonymous users can select person." ON "public"."person" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Demographics can be insected by everyone." ON "public"."person_demographics" FOR INSERT WITH CHECK ((("auth"."role"() = 'authenticated'::"text") AND (("auth"."jwt"() ->> 'is_anonymous'::"text") = 'true'::"text")));



CREATE POLICY "Demographics can be selected by everyone." ON "public"."demographics" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Demographics can be selected by everyone." ON "public"."person_demographics" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Habitat can be selected by everyone." ON "public"."habitat" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Habitat can be updated by everyone." ON "public"."habitat" FOR UPDATE WITH CHECK ((("auth"."role"() = 'authenticated'::"text") AND (("auth"."jwt"() ->> 'is_anonymous'::"text") = 'true'::"text")));



CREATE POLICY "Person can be inserted by everyone." ON "public"."person" FOR INSERT WITH CHECK ((("auth"."role"() = 'authenticated'::"text") AND (("auth"."jwt"() ->> 'is_anonymous'::"text") = 'true'::"text")));



CREATE POLICY "Person can be selected by everyone." ON "public"."person" FOR SELECT TO "authenticated" USING (true);



ALTER TABLE "public"."demographics" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."habitat" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."person" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."person_demographics" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";








































































































































































GRANT ALL ON TABLE "public"."demographics" TO "anon";
GRANT ALL ON TABLE "public"."demographics" TO "authenticated";
GRANT ALL ON TABLE "public"."demographics" TO "service_role";



GRANT ALL ON TABLE "public"."habitat" TO "anon";
GRANT ALL ON TABLE "public"."habitat" TO "authenticated";
GRANT ALL ON TABLE "public"."habitat" TO "service_role";



GRANT ALL ON TABLE "public"."person" TO "anon";
GRANT ALL ON TABLE "public"."person" TO "authenticated";
GRANT ALL ON TABLE "public"."person" TO "service_role";



GRANT ALL ON TABLE "public"."person_demographics" TO "anon";
GRANT ALL ON TABLE "public"."person_demographics" TO "authenticated";
GRANT ALL ON TABLE "public"."person_demographics" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";































drop extension if exists "pg_net";


