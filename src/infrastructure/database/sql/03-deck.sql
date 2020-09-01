CREATE TABLE public.deck (
    id uuid NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    image_url text,
    owner_id uuid NOT NULL,
    created_at timestamp WITH time zone NOT NULL
);

ALTER TABLE public.deck OWNER TO miczeq;

ALTER TABLE public.deck
    ADD CONSTRAINT deck_pkey PRIMARY KEY (id);