const sqlite3 = require("sqlite3").verbose();
const { promisify } = require("util");

const dbName = "RealEstate_Luming_bp.sqlite3";

async function getCars(){
	const db = new sqlite3.Database(dbName);

	const query = `select home.homeID as houseID, Owner.firstName as ownerName
	from home
	inner JOIN
	Home_Owner
	on home.homeID = Home_Owner.homeID
	inner JOIN
	Owner
	on Home_Owner.ownerID = owner.ownerID;
	`;

	const promise = promisify(db.all.bind(db));

	return promise(query).finally(() => db.close());

}

async function runScripts(){
	const rows = await getCars();

	console.log("I found these rows", rows);
}

runScripts();



