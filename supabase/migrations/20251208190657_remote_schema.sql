
  create table "public"."questions" (
    "question_id" character varying(12) not null
      );


alter table "public"."questions" enable row level security;

alter table "public"."habitat" add column "question_id" character varying(12) not null;

CREATE UNIQUE INDEX questions_pk ON public.questions USING btree (question_id);

alter table "public"."questions" add constraint "questions_pk" PRIMARY KEY using index "questions_pk";

alter table "public"."habitat" add constraint "habitat_to_questions_fk" FOREIGN KEY (question_id) REFERENCES public.questions(question_id) not valid;

alter table "public"."habitat" validate constraint "habitat_to_questions_fk";

set check_function_bodies = off;

CREATE OR REPLACE PROCEDURE public.apply_habitat_elo(IN p_person_id uuid, IN p_question_id text, IN p_winner_id integer, IN p_loser_id integer, IN p_k numeric DEFAULT 24.0)
 LANGUAGE plpgsql
AS $procedure$
begin
  if p_winner_id = p_loser_id then
    raise exception 'winner and loser cannot be the same (habitat_id=%)', p_winner_id;
  end if;

  with rankings as (
    select pd.demographic,
           pd.demographic_value,
           h.habitat_id,
           h.mu
    from person_demographics pd
    join habitat h using (demographic, demographic_value)
    where pd.person_id = p_person_id
      and h.question_id = p_question_id
  ),
  expectation as (
    select
      w.demographic,
      w.demographic_value,
      1.0 / (1.0 + power(10.0, (l.mu - w.mu) / 400.0)) as expected_win
    from rankings w
    join rankings l using (demographic, demographic_value)
    where w.habitat_id = p_winner_id
      and l.habitat_id = p_loser_id
  ),
  deltas as (
    select
      demographic,
      demographic_value,
      p_k * (1.0 - expected_win) as delta_winner,  -- add to winner
      -p_k * expected_win        as delta_loser    -- add to loser
    from expectation
  )
  update habitat h
     set mu = h.mu + case
                       when h.habitat_id = p_winner_id then d.delta_winner
                       when h.habitat_id = p_loser_id  then d.delta_loser
                     end,
         rankings = coalesce(h.rankings, 0) + 1
    from deltas d
   where h.demographic = d.demographic
     and h.demographic_value = d.demographic_value
     and h.question_id = p_question_id
     and h.habitat_id in (p_winner_id, p_loser_id);

  -- increment the person's total comparisons
  update "person"
     set rankings = coalesce(rankings, 0) + 1
   where person_id = p_person_id;
end;
$procedure$
;

CREATE OR REPLACE PROCEDURE public.next_pair(IN given_person_id uuid, IN habitat_winner numeric, IN habitat_loser numeric)
 LANGUAGE sql
BEGIN ATOMIC
 SELECT person_demographics.person_id,
     person_demographics.demographic,
     person_demographics.demographic_value
    FROM public.person_demographics
   WHERE (person_demographics.person_id = next_pair.given_person_id);
END
;

CREATE OR REPLACE FUNCTION public.next_pair_for_person(p_person_id uuid)
 RETURNS TABLE(habitat1_id integer, habitat2_id integer, question_id text)
 LANGUAGE sql
 STABLE
AS $function$
with rankings as (
  select
    h.habitat_id,
    h.mu,
    h.demographic,
    h.demographic_value,
    h.question_id
  from person_demographics pd
  join habitat h using (demographic, demographic_value)
  where pd.person_id = p_person_id
),
pairs as (
  select
    h1.habitat_id as habitat1_id,
    h2.habitat_id as habitat2_id,
    abs(h1.mu - h2.mu) as mu_diff,
    h1.demographic,
    h1.demographic_value,
    h1.question_id
  from rankings h1
  join rankings h2
    on h1.habitat_id < h2.habitat_id
   and h1.demographic = h2.demographic
   and h1.demographic_value = h2.demographic_value
   and h1.question_id = h2.question_id
)
select
  habitat1_id, habitat2_id, question_id
from pairs
order by mu_diff asc, random()
limit 1;
$function$
;

grant delete on table "public"."questions" to "anon";

grant insert on table "public"."questions" to "anon";

grant references on table "public"."questions" to "anon";

grant select on table "public"."questions" to "anon";

grant trigger on table "public"."questions" to "anon";

grant truncate on table "public"."questions" to "anon";

grant update on table "public"."questions" to "anon";

grant delete on table "public"."questions" to "authenticated";

grant insert on table "public"."questions" to "authenticated";

grant references on table "public"."questions" to "authenticated";

grant select on table "public"."questions" to "authenticated";

grant trigger on table "public"."questions" to "authenticated";

grant truncate on table "public"."questions" to "authenticated";

grant update on table "public"."questions" to "authenticated";

grant delete on table "public"."questions" to "service_role";

grant insert on table "public"."questions" to "service_role";

grant references on table "public"."questions" to "service_role";

grant select on table "public"."questions" to "service_role";

grant trigger on table "public"."questions" to "service_role";

grant truncate on table "public"."questions" to "service_role";

grant update on table "public"."questions" to "service_role";


  create policy "Questions can be selected by everyone."
  on "public"."questions"
  as permissive
  for select
  to authenticated
using (true);



