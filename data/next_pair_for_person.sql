create or replace function next_pair_for_person(
  p_person_id   uuid
)
returns table (
  habitat1_id       int,
  habitat2_id       int,
  question_id       text
)
language sql
stable
as $$
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
$$;