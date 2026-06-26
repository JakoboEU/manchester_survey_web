create index if not exists person_demographics_person_demo_idx
    on person_demographics (person_id, demographic, demographic_value);

CREATE INDEX IF NOT EXISTS idx_habitat_lookup_speed
    ON habitat (demographic, demographic_value, question_id)
    INCLUDE (habitat_id, mu);