-- public.symbol definition

-- Drop table

-- DROP TABLE public.symbol;

CREATE TABLE public.symbol (
	"Seq" int4 NULL,
	"Symbol" varchar(50) NULL,
	" MarketCapital " varchar(50) NULL,
	"Industry" varchar(50) NULL,
	"SET50" int4 NULL,
	"SETHD" int4 NULL
);

-- public.market_signals definition

-- Drop table

-- DROP TABLE public.market_signals;

CREATE TABLE public.market_signals (
	id serial4 NOT NULL,
	symbol varchar(20) NOT NULL,
	last_close numeric(20, 8) NULL,
	signal varchar(250) NULL,
	trend varchar(250) NULL,
	rsi_14 numeric(5, 2) NULL,
	rsi_overbought numeric(5, 2) DEFAULT 70 NULL,
	rsi_oversold numeric(5, 2) DEFAULT 30 NULL,
	ema_50 numeric(20, 8) NULL,
	ema_200 numeric(20, 8) NULL,
	golden_cross bool DEFAULT false NULL,
	death_cross bool DEFAULT false NULL,
	updated_at timestamp DEFAULT CURRENT_TIMESTAMP NULL,
	CONSTRAINT market_signals_pkey PRIMARY KEY (id)
);
CREATE INDEX idx_symbol ON public.market_signals USING btree (symbol);


-- public.candle_sticks definition

-- Drop table

-- DROP TABLE public.candle_sticks;

CREATE TABLE public.candle_sticks (
	symbol varchar NOT NULL,
	x date NOT NULL,
	o numeric NOT NULL,
	h numeric NOT NULL,
	l numeric NOT NULL,
	c numeric NOT NULL
);