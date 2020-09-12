CREATE TABLE public.user_deck (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    deck_id uuid NOT NULL,
    enrolled_at timestamp WITH time zone NOT NULL
);

ALTER TABLE public.user_deck OWNER TO miczeq;

ALTER TABLE public.user_deck
    ADD CONSTRAINT user_deck_pkey PRIMARY KEY (id);
    