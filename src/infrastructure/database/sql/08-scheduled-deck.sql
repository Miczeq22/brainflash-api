CREATE TABLE public.scheduled_deck (
    id uuid NOT NULL,
    deck_id uuid NOT NULL,
    user_id uuid NOT NULL,
    owner_id uuid NOT NULL,
    scheduled_date timestamp WITH time zone NOT NULL,
    scheduled_at timestamp WITH time zone NOT NULL
);

ALTER TABLE public.scheduled_deck OWNER TO miczeq;

ALTER TABLE public.scheduled_deck
    ADD CONSTRAINT scheduled_deck_pkey PRIMARY KEY (id);