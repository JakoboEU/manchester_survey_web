-- Drops existing function of same name, if any (optional)
-- drop function if exists apply_habitat_elo(uuid, text, int, int, numeric);

create or replace procedure apply_habitat_elo(
  p_person_id   uuid,
  p_question_id text,
  p_winner_id   int,
  p_loser_id    int,
  p_k           numeric default 24.0
)
language plpgsql
as $$
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
set rankings = rankings + 1
where person_id = p_person_id;
end;
$$;

-- Usage:
-- call apply_habitat_elo('e5251087-1f60-41a6-83c9-1c84d637ce5f', 'biodiversity', 2, 1, 24.0);
