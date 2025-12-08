alter table person enable row level security;

create policy "Person can be selected by everyone."
    on person for select
    to authenticated
    using ( true );

create policy "Person can be inserted by everyone."
    on person for insert
    with check (
      auth.role() = 'authenticated'
      and auth.jwt()->>'is_anonymous' = 'true'
    );

alter table demographics enable row level security;

create policy "Demographics can be selected by everyone."
   on demographics for select
   to authenticated
   using ( true );

alter table questions enable row level security;

create policy "Questions can be selected by everyone."
    on questions for select
    to authenticated
    using ( true );

alter table person_demographics enable row level security;

create policy "Demographics can be selected by everyone."
    on person_demographics for select
    to authenticated
    using ( true );

create policy "Demographics can be insected by everyone."
    on person_demographics for insert
    with check (
      auth.role() = 'authenticated'
      and auth.jwt()->>'is_anonymous' = 'true'
    );

alter table habitat enable row level security;

create policy "Habitat can be selected by everyone."
    on habitat for select
    to authenticated
    using ( true );

create policy "Habitat can be updated by everyone."
    on habitat for update
    with check (
        auth.role() = 'authenticated'
        and auth.jwt()->>'is_anonymous' = 'true'
    );