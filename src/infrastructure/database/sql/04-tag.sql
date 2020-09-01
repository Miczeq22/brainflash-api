CREATE TABLE public.tag (
    id uuid NOT NULL,
    name text NOT NULL,
    created_at timestamp WITH time zone NOT NULL
);

ALTER TABLE public.tag OWNER TO miczeq;

ALTER TABLE public.tag
    ADD CONSTRAINT tag_pkey PRIMARY KEY (id);