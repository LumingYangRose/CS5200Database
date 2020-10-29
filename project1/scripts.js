const sqlite3 = require("sqlite3").verbose();
const { promisify } = require("util");

const dbName = "RealEstate_Luming_bp.sqlite3";

function getCars(){
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

	const callback = (err, rows) => {
		if (err) {
			throw err;
		}

		console.log("Got", rows.length, " rows");
		console.log(rows);

		for (let r of rows) {
			console.log(`The house ${r.houseID} is owned by ${r.ownerName}.`);
		}
		db.close();
		return rows;
	};

	db.all(query, callback);
	return rows;
}

function async runScripts(){
	const rows = await getCars();

	console.log("I found these rows", rows);
}

runScripts();



