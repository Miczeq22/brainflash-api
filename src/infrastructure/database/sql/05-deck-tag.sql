CREATE TABLE public.deck_tag (
    id uuid NOT NULL,
    deck_id uuid NOT NULL,
    tag_id uuid NOT NULL
);

ALTER TABLE public.deck_tag OWNER TO miczeq;

ALTER TABLE public.deck_tag
    ADD CONSTRAINT deck_tag_pkey PRIMARY KEY (id);
    