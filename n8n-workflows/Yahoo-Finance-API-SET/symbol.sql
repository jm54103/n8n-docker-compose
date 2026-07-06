/*
INSERT INTO public.symbol
("Seq", "Symbol", " MarketCapital ", "Industry", "SET50", "SETHD")
VALUES(9001, 'USDTHB=X', 'USD/THB', 'Currency Exchange', 0, 1);

INSERT INTO public.symbol
("Seq", "Symbol", " MarketCapital ", "Industry", "SET50", "SETHD")
VALUES(9002, 'DX-Y.NYB', 'USD', 'Currency Exchange', 0, 1);

INSERT INTO public.symbol
("Seq", "Symbol", " MarketCapital ", "Industry", "SET50", "SETHD")
VALUES(9011, 'CNH=X', 'USD/CNH (Offshore)', 'Currency Exchange', 0, 1);

INSERT INTO public.symbol
("Seq", "Symbol", " MarketCapital ", "Industry", "SET50", "SETHD")
VALUES(9012, 'CNY=X', 'USD/CNH (Onshore)', 'Currency Exchange', 0, 1);


INSERT INTO public.symbol
("Seq", "Symbol", " MarketCapital ", "Industry", "SET50", "SETHD")
VALUES(8001, '^SET.BK', 'SET', 'TH', 0, 1);

INSERT INTO public.symbol
("Seq", "Symbol", " MarketCapital ", "Industry", "SET50", "SETHD")
VALUES(8002, '^SET50.BK', 'SET50', 'TH', 0, 1);

update public.symbol set "SETHD"=0 where  "Seq">8000;
update public.symbol set "SETHD"=1 where  "Seq"=8001;
update public.symbol set "SETHD"=1 where  "Seq"=8002;

INSERT INTO public.symbol
("Seq", "Symbol", " MarketCapital ", "Industry", "SET50", "SETHD")
VALUES(5002, '000001.SS', 'SSE Composite Index', 'CN', 0, 1);

INSERT INTO public.symbol
("Seq", "Symbol", " MarketCapital ", "Industry", "SET50", "SETHD")
VALUES(5003, '399001.SZ', 'Shenzhen Component Index', 'CN', 0, 1);

INSERT INTO public.symbol
("Seq", "Symbol", " MarketCapital ", "Industry", "SET50", "SETHD")
VALUES(5004, '^HSCE', 'Hang Seng China Enterprises Index', 'CN', 0, 1);

delete from public.symbol where "Seq"=5011;

*/

update public.symbol set "SETHD"=1 where  "Seq" > 0;






