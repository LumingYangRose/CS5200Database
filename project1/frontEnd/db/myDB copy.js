var sqlite3 = require("sqlite3").verbose();
const util = require("util");

function myDB() {
  const myDB = {};

  const getDb = () => new sqlite3.Database("./db/RealEstate_Luming_bp.db");

  myDB.getHomes = function (page) {
    const db = getDb();

    const PAGE_SIZE = 10;
    const query = `SELECT *
      FROM Home
      LIMIT ${PAGE_SIZE} OFFSET ${PAGE_SIZE * (page - 1)};`;

    const allPromise = util.promisify(db.all.bind(db));

    return allPromise(query).finally(() => {
      console.log("done, closing");
      db.close();
    });
  };

  myDB.createHome = function (home) {
    const db = getDb();

    const query = `
    INSERT INTO Home(homeType, bedrooms, bathrooms, interiorArea, lot)
VALUES($homeType, $bedrooms, $bathrooms, $interiorArea, $lot);`;

    const runPromise = util.promisify(db.run.bind(db));

    return runPromise(query, home).finally(() => db.close());
  };

  myDB.updateHome = function (home) {
    const db = getDb();

    const query = `
    UPDATE Home
    SET
      homeType = $homeType,
      bedrooms = $bedrooms,
      bathrooms = $bathrooms,
      interiorArea = $interiorArea,
      lot = $lot
    WHERE
      homeID = $homeID;`;

    const runPromise = util.promisify(db.run.bind(db));

    return runPromise(query, {
      $homeID: +home.$homeID,
      $homeType: home.$homeType,
      $bedrooms: +home.$bedrooms,
      $bathrooms: +home.$bathrooms,
      $interiorArea: +home.$interiorArea,
      $lot: +home.$lot,
    })
      .then(() => db)
      .finally(() => db.close());
  };

  myDB.deleteHome = function (homeID) {
    const db = getDb();

    const query = `
    DELETE FROM Home WHERE Home.homeID=$homeID;`;

    return new Promise((resolve, reject) => {
      db.run(
        query,
        {
          $homeID: homeID,
        },
        function (err) {
          if (err) {
            return reject(err);
          }

          return resolve({ lastID: this.lastID, changes: this.changes });
        }
      );
    });

    // const runPromise = util.promisify(db.run.bind(db));

    // return runPromise(query, {
    //   $trackId: songId,
    // }).finally(() => db.close());
  };

  return myDB;
}

module.exports = myDB();
