create table person (
    person_id uuid primary key,
    rankings bigint default 0
);

create table demographics (
    demographic character varying (10) not null,
    demographic_value character varying (10) not null,
    constraint demographics_pk primary key (demographic, demographic_value)
);

create table person_demographics (
     person_id uuid references person,
     demographic character varying (10) not null,
     demographic_value character varying (10) not null,
     constraint person_to_demographics_fk foreign key (demographic, demographic_value) references demographics
);

create table habitat (
     demographic character varying (10) not null,
     demographic_value character varying (10) not null,
     habitat_id int not null,
     mu numeric not null default 1500.0,
     rankings bigint default 0,
     constraint habitat_to_demographics_fk foreign key (demographic, demographic_value) references demographics
);