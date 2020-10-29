-- 1. Show homes with the homeID, the address, the market price, and the property status:
select Home.homeID, Location.address, Price.marketPrice, PropertyStatus.status
from home as h 
	inner join location as l
		on h.homeID = l.homeID
	inner join price as p
		on l.homeID = p.homeID
	inner join PropertyStatus as ps
		on p.homeID = ps.homeID;

-- 2. How many buyers have bought more than one home?
select count(*) 
	from (
		select Home_buyer.homeID 
			from Home_Buyer 
			group by Home_Buyer.buyerID
			having count(Home_Buyer.buyerID) >= 2
	);

-- 3. Show the location information in states where there are more than 30 homes:
select location.* 
from Location
group by location.state
having (location.homeID >30)

-- 4. Show the homes that haven't got buyers:
select Home.* 
from Home 
where home.homeID in
(select Home_Buyer.homeID
from Home_Buyer
where buyerID is null)

-- 5. Which agent has brought the biggest order for the company so far?
select price.lastPrice, home.homeID, agent.firstName
from price 
	inner join Home
	on price.homeID = home.homeID
	inner join Home_Agent
	on home.homeID = Home_Agent.homeID
	inner join Agent
	on Home_Agent.agentID = Agent.agentID
order by lastPrice desc