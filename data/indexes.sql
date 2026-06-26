-- `person_demographics`: fast lookup by person, then join keys
create index if not exists person_demographics_person_demo_idx
    on person_demographics (person_id, demographic, demographic_value);

-- `habitat`: join/filter access path for rankings CTE
create index if not exists habitat_demo_q_hab_idx
    on habitat (demographic, demographic_value, question_id, habitat_id);

-- Optional covering index for rankings CTE (PG11+), avoids heap reads for mu
create index if not exists habitat_demo_q_hab_inc_mu_idx
    on habitat (demographic, demographic_value, question_id, habitat_id) include (mu);
