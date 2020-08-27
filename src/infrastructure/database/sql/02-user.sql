CREATE TABLE public.user (
    id uuid NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    username text NOT NULL,
    account_status text NOT NULL,
    registration_date timestamp WITH time zone NOT NULL,
    confirmation_date timestamp WITH time zone
);

ALTER TABLE public.user OWNER TO miczeq;

ALTER TABLE public.user
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);