const sqlite3 = require("sqlite3").verbose();

const { promisify } = require("util");

// db.all(query, params, function (err, rows) {
//   if (err) {
//     throw err;
//   }

//   console.log("Got rows", rows);
// });

async function getRows() {
  const db = new sqlite3.Database("./db/test.db");
  const dbAllPromise = promisify(db.all.bind(db));
  console.log("Running query");

  const query = `SELECT * FROM tracks
    WHERE AlbumId = $AlbumId
    LIMIT 20`;

  const params = {
    $AlbumId: 3,
  };
  return dbAllPromise(query, params).finally(() => db.close());
}

async function getNumberOfSongs() {
  const db = new sqlite3.Database("./db/test.db");

  const promise = promisify(db.get.bind(db));

  const query = "SELECT count() as count FROM tracks";

  return promise(query).finally(() => db.close());
}

async function runQueries() {
  const rows = await getRows();
  console.log("rows", rows);

  const numSongs = await getNumberOfSongs();

  console.log("numSongs", numSongs);
}

runQueries();
