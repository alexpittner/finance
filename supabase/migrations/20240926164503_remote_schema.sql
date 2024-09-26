

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


CREATE EXTENSION IF NOT EXISTS "pgsodium" WITH SCHEMA "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."insert_default_expense_categories"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$BEGIN
  -- Insert default categories into the expense_categories table for the new user
  INSERT INTO expense_categories (id, user_id, category_name, created_at, updated_at)
  VALUES 
    (uuid_generate_v4(), NEW.id, 'Marketing', NOW(), NOW()),
    (uuid_generate_v4(), NEW.id, 'Software', NOW(), NOW()),
    (uuid_generate_v4(), NEW.id, 'Office Supplies', NOW(), NOW()),
    (uuid_generate_v4(), NEW.id, 'Salaries', NOW(), NOW()),
    (uuid_generate_v4(), NEW.id, 'Rent', NOW(), NOW()),
    (uuid_generate_v4(), NEW.id, 'Utilities', NOW(), NOW()),
    (uuid_generate_v4(), NEW.id, 'Transaction Fees', NOW(), NOW());
    
  RETURN NEW;
END;$$;


ALTER FUNCTION "public"."insert_default_expense_categories"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."insert_default_expense_categories"("user_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  -- Insert default categories into the expense_categories table for the new user
  INSERT INTO expense_categories (id, user_id, category_name, created_at, updated_at)
  VALUES 
    (uuid_generate_v4(), user_id, 'Marketing', NOW(), NOW()),
    (uuid_generate_v4(), user_id, 'Software', NOW(), NOW()),
    (uuid_generate_v4(), user_id, 'Office Supplies', NOW(), NOW()),
    (uuid_generate_v4(), user_id, 'Salaries', NOW(), NOW()),
    (uuid_generate_v4(), user_id, 'Rent', NOW(), NOW()),
    (uuid_generate_v4(), user_id, 'Utilities', NOW(), NOW()),
    (uuid_generate_v4(), user_id, 'Transaction Fees', NOW(), NOW());
END;
$$;


ALTER FUNCTION "public"."insert_default_expense_categories"("user_id" "uuid") OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."companies" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid",
    "name" character varying(255) NOT NULL,
    "industry" character varying(100),
    "type" character varying(50),
    "start_date" "date",
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    "updated_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."companies" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."employee_expenditures" (
    "id" "uuid" NOT NULL,
    "employee_id" "uuid",
    "expense_id" "uuid",
    "start_date" "date" NOT NULL,
    "end_date" "date",
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."employee_expenditures" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."employee_salaries" (
    "id" "uuid" NOT NULL,
    "employee_id" "uuid",
    "salary_type" character varying(50) NOT NULL,
    "amount" numeric(12,2) NOT NULL,
    "start_date" "date" NOT NULL,
    "end_date" "date",
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."employee_salaries" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."expense_categories" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "category_name" character varying(255) NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."expense_categories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."funding" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "funding_type" character varying(50) NOT NULL,
    "amount" numeric NOT NULL,
    "investor" character varying(255),
    "equity_percentage" numeric DEFAULT 0,
    "funding_date" "date" NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"(),
    CONSTRAINT "funding_funding_type_check" CHECK ((("funding_type")::"text" = ANY ((ARRAY['cash_injection'::character varying, 'safe_agreement'::character varying])::"text"[])))
);


ALTER TABLE "public"."funding" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."one_time_expenditures" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" character varying(255) NOT NULL,
    "amount" numeric NOT NULL,
    "expenditure_date" "date" NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"(),
    "category_id" "uuid"
);


ALTER TABLE "public"."one_time_expenditures" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."people_salaries" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" character varying(255) NOT NULL,
    "salary_type" character varying(50) NOT NULL,
    "salary_amount" numeric NOT NULL,
    "linked_recurring_expenditure" "uuid",
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"(),
    CONSTRAINT "people_salaries_salary_type_check" CHECK ((("salary_type")::"text" = ANY ((ARRAY['hourly'::character varying, 'yearly'::character varying])::"text"[])))
);


ALTER TABLE "public"."people_salaries" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."products" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "user_id" "uuid",
    "name" character varying(255) NOT NULL,
    "price" numeric NOT NULL,
    "description" "text",
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"(),
    "type" character varying(50) NOT NULL,
    "billing_period" character varying(50),
    "subscription_start" "date",
    "subscription_end" "date",
    "discount" numeric DEFAULT 0,
    "cohort" character varying(255),
    "currency" character varying(3) NOT NULL,
    "product_type" character varying(50) NOT NULL,
    CONSTRAINT "products_product_type_check" CHECK ((("product_type")::"text" = ANY ((ARRAY['one-time'::character varying, 'subscription'::character varying])::"text"[]))),
    CONSTRAINT "products_type_check" CHECK ((("type")::"text" = ANY ((ARRAY['one-time'::character varying, 'subscription'::character varying])::"text"[])))
);


ALTER TABLE "public"."products" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."projected_employees" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "company_id" "uuid",
    "scenario_id" "uuid",
    "title" character varying(255) NOT NULL,
    "start_date" "date" NOT NULL,
    "end_date" "date",
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."projected_employees" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."projected_expenses" (
    "id" "uuid" NOT NULL,
    "company_id" "uuid",
    "scenario_id" "uuid",
    "name" character varying(255) NOT NULL,
    "expense_type" character varying(50) NOT NULL,
    "category_id" "uuid",
    "seat_cost" boolean DEFAULT false,
    "amount" numeric(12,2) NOT NULL,
    "date" "date" NOT NULL,
    "recurrence_interval" character varying(50),
    "end_date" "date",
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."projected_expenses" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."recurring_expenditures" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "name" character varying(255) NOT NULL,
    "amount" numeric NOT NULL,
    "linked_to_userbase" boolean DEFAULT false,
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"(),
    "category_id" "uuid"
);


ALTER TABLE "public"."recurring_expenditures" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."scenarios" (
    "id" "uuid" NOT NULL,
    "company_id" "uuid",
    "name" character varying(100) NOT NULL,
    "assumptions" "text",
    "created_at" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE "public"."scenarios" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."transaction_fees" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "processor" character varying(255) NOT NULL,
    "fee_percentage" numeric NOT NULL,
    "fixed_fee" numeric DEFAULT 0,
    "product_id" "uuid",
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."transaction_fees" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "id" "uuid" DEFAULT "extensions"."uuid_generate_v4"() NOT NULL,
    "auth0_id" character varying(255) NOT NULL,
    "email" character varying(255) NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"(),
    "updated_at" timestamp without time zone DEFAULT "now"()
);


ALTER TABLE "public"."users" OWNER TO "postgres";


ALTER TABLE ONLY "public"."companies"
    ADD CONSTRAINT "companies_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."employee_expenditures"
    ADD CONSTRAINT "employee_expenditures_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."employee_salaries"
    ADD CONSTRAINT "employee_salaries_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."expense_categories"
    ADD CONSTRAINT "expense_categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."funding"
    ADD CONSTRAINT "funding_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."one_time_expenditures"
    ADD CONSTRAINT "one_time_expenditures_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."people_salaries"
    ADD CONSTRAINT "people_salaries_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."projected_employees"
    ADD CONSTRAINT "projected_employees_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."projected_expenses"
    ADD CONSTRAINT "projected_expenses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."recurring_expenditures"
    ADD CONSTRAINT "recurring_expenditures_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."scenarios"
    ADD CONSTRAINT "scenarios_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."transaction_fees"
    ADD CONSTRAINT "transaction_fees_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."companies"
    ADD CONSTRAINT "unique_user_per_company" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_auth0_id_key" UNIQUE ("auth0_id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_email_key" UNIQUE ("email");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");



CREATE OR REPLACE TRIGGER "add_default_categories" AFTER INSERT ON "public"."users" FOR EACH ROW EXECUTE FUNCTION "public"."insert_default_expense_categories"();



ALTER TABLE ONLY "public"."companies"
    ADD CONSTRAINT "companies_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."companies"
    ADD CONSTRAINT "companies_user_id_fkey1" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id");



ALTER TABLE ONLY "public"."employee_expenditures"
    ADD CONSTRAINT "employee_expenditures_expense_id_fkey" FOREIGN KEY ("expense_id") REFERENCES "public"."projected_expenses"("id");



ALTER TABLE ONLY "public"."expense_categories"
    ADD CONSTRAINT "expense_categories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."one_time_expenditures"
    ADD CONSTRAINT "one_time_expenditures_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."expense_categories"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."people_salaries"
    ADD CONSTRAINT "people_salaries_linked_recurring_expenditure_fkey" FOREIGN KEY ("linked_recurring_expenditure") REFERENCES "public"."recurring_expenditures"("id");



ALTER TABLE ONLY "public"."products"
    ADD CONSTRAINT "products_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."projected_employees"
    ADD CONSTRAINT "projected_employees_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id");



ALTER TABLE ONLY "public"."projected_employees"
    ADD CONSTRAINT "projected_employees_scenario_id_fkey" FOREIGN KEY ("scenario_id") REFERENCES "public"."scenarios"("id");



ALTER TABLE ONLY "public"."projected_expenses"
    ADD CONSTRAINT "projected_expenses_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."expense_categories"("id");



ALTER TABLE ONLY "public"."projected_expenses"
    ADD CONSTRAINT "projected_expenses_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id");



ALTER TABLE ONLY "public"."projected_expenses"
    ADD CONSTRAINT "projected_expenses_scenario_id_fkey" FOREIGN KEY ("scenario_id") REFERENCES "public"."scenarios"("id");



ALTER TABLE ONLY "public"."recurring_expenditures"
    ADD CONSTRAINT "recurring_expenditures_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."expense_categories"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."scenarios"
    ADD CONSTRAINT "scenarios_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "public"."companies"("id");



ALTER TABLE ONLY "public"."transaction_fees"
    ADD CONSTRAINT "transaction_fees_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE CASCADE;





ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";
































































































































































































GRANT ALL ON FUNCTION "public"."insert_default_expense_categories"() TO "anon";
GRANT ALL ON FUNCTION "public"."insert_default_expense_categories"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."insert_default_expense_categories"() TO "service_role";



GRANT ALL ON FUNCTION "public"."insert_default_expense_categories"("user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."insert_default_expense_categories"("user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."insert_default_expense_categories"("user_id" "uuid") TO "service_role";





















GRANT ALL ON TABLE "public"."companies" TO "anon";
GRANT ALL ON TABLE "public"."companies" TO "authenticated";
GRANT ALL ON TABLE "public"."companies" TO "service_role";



GRANT ALL ON TABLE "public"."employee_expenditures" TO "anon";
GRANT ALL ON TABLE "public"."employee_expenditures" TO "authenticated";
GRANT ALL ON TABLE "public"."employee_expenditures" TO "service_role";



GRANT ALL ON TABLE "public"."employee_salaries" TO "anon";
GRANT ALL ON TABLE "public"."employee_salaries" TO "authenticated";
GRANT ALL ON TABLE "public"."employee_salaries" TO "service_role";



GRANT ALL ON TABLE "public"."expense_categories" TO "anon";
GRANT ALL ON TABLE "public"."expense_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."expense_categories" TO "service_role";



GRANT ALL ON TABLE "public"."funding" TO "anon";
GRANT ALL ON TABLE "public"."funding" TO "authenticated";
GRANT ALL ON TABLE "public"."funding" TO "service_role";



GRANT ALL ON TABLE "public"."one_time_expenditures" TO "anon";
GRANT ALL ON TABLE "public"."one_time_expenditures" TO "authenticated";
GRANT ALL ON TABLE "public"."one_time_expenditures" TO "service_role";



GRANT ALL ON TABLE "public"."people_salaries" TO "anon";
GRANT ALL ON TABLE "public"."people_salaries" TO "authenticated";
GRANT ALL ON TABLE "public"."people_salaries" TO "service_role";



GRANT ALL ON TABLE "public"."products" TO "anon";
GRANT ALL ON TABLE "public"."products" TO "authenticated";
GRANT ALL ON TABLE "public"."products" TO "service_role";



GRANT ALL ON TABLE "public"."projected_employees" TO "anon";
GRANT ALL ON TABLE "public"."projected_employees" TO "authenticated";
GRANT ALL ON TABLE "public"."projected_employees" TO "service_role";



GRANT ALL ON TABLE "public"."projected_expenses" TO "anon";
GRANT ALL ON TABLE "public"."projected_expenses" TO "authenticated";
GRANT ALL ON TABLE "public"."projected_expenses" TO "service_role";



GRANT ALL ON TABLE "public"."recurring_expenditures" TO "anon";
GRANT ALL ON TABLE "public"."recurring_expenditures" TO "authenticated";
GRANT ALL ON TABLE "public"."recurring_expenditures" TO "service_role";



GRANT ALL ON TABLE "public"."scenarios" TO "anon";
GRANT ALL ON TABLE "public"."scenarios" TO "authenticated";
GRANT ALL ON TABLE "public"."scenarios" TO "service_role";



GRANT ALL ON TABLE "public"."transaction_fees" TO "anon";
GRANT ALL ON TABLE "public"."transaction_fees" TO "authenticated";
GRANT ALL ON TABLE "public"."transaction_fees" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
