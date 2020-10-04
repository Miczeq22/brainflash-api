CREATE TABLE public.deck_rating (
    id uuid NOT NULL,
    deck_id uuid NOT NULL,
    user_id uuid NOT NULL,
    rating INT NOT NULL
);

ALTER TABLE public.deck_rating OWNER TO miczeq;

ALTER TABLE public.deck_rating
    ADD CONSTRAINT deck_rating_pkey PRIMARY KEY (id);