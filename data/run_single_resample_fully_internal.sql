create or replace procedure run_single_resample_fully_internal()
language plpgsql
as $$
declare
    v_person_id uuid;
  v_last_question_id text;
  v_habitat1 int;
  v_habitat2 int;
  v_question_id text;
  v_winner int;
  v_loser int;
  v_last_questions jsonb := '{}'::jsonb;
begin

update person set rankings = 0;
update habitat set mu = 1500.0, rankings = 0;

for v_person_id in
    select pb.person_id
    from person_baseline pb
             cross join lateral generate_series(1, pb.rankings)
    order by random()
    loop
        v_habitat1 := null;
        v_habitat2 := null;
        v_question_id := null;

        v_last_question_id := v_last_questions ->> v_person_id::text;

        select habitat1_id, habitat2_id, question_id
        into v_habitat1, v_habitat2, v_question_id
        from next_pair_for_person2(v_person_id, v_last_question_id);

        if random() > 0.5 then
            v_winner := v_habitat1; v_loser := v_habitat2;
        else
            v_winner := v_habitat2; v_loser := v_habitat1;
        end if;

        call apply_habitat_elo(v_person_id, v_question_id, v_winner, v_loser);
        v_last_questions := v_last_questions || jsonb_build_object(v_person_id::text, v_question_id);
    end loop;
end;
$$;
