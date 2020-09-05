CREATE TABLE public.card (
    id uuid NOT NULL,
    deck_id uuid NOT NULL,
    question text NOT NULL,
    answer text NOT NULL,
    created_at timestamp WITH time zone NOT NULL
);

ALTER TABLE public.card OWNER TO miczeq;

ALTER TABLE public.card
    ADD CONSTRAINT card_pkey PRIMARY KEY (id);
    