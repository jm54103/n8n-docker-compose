
update symbol set "MarketIndex"=null 
from symbol s 
inner join symbol_set_classified ssc on s."Symbol"=ssc.symbol;

update symbol s set "MarketIndex"='SET50'
from symbol_set_classified ssc
where s."Symbol" =ssc.symbol and ssc."SET50"='✓';

update symbol s set "MarketIndex"=concat_ws(',',s."MarketIndex",'SET100')
from symbol_set_classified ssc
where s."Symbol" =ssc.symbol and ssc."SET100"='✓';

update symbol s set "MarketIndex"=concat_ws(',',s."MarketIndex",'SETHD')
from symbol_set_classified ssc
where s."Symbol" =ssc.symbol and ssc."SETHD"='✓';

select s."Symbol", s."MarketIndex", ssc."SET50", ssc."SET100", ssc."SETHD" 
from symbol s 
inner join symbol_set_classified ssc on s."Symbol"=ssc.symbol;

