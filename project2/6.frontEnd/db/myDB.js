const { MongoClient, ObjectId } = require("mongodb");

function myDB() {
  const myDB = {};
  const dbName = "RealEstate";
  const colName = "Homes";
  const uri = process.env.MONGO_URL || "mongodb://localhost:27017";

  myDB.getHomes = async function (page) {
    const client = MongoClient(uri, { useUnifiedTopology: true });
    try {
      await client.connect();
      const db = client.db(dbName);
      const col = db.collection(colName);
      const query = {};

      return await col
        .find(query)
        // sort in descending order by creation
        .sort({ _id: -1 })
        .limit(20)
        .toArray();
    } finally {
      client.close();
    }
  };

  myDB.createHome = async function (home) {
    const client = MongoClient(uri, { useUnifiedTopology: true });
    try {
      await client.connect();
      const db = client.db(dbName);
      const col = db.collection(colName);

      return await col.insertOne(home);
    } finally {
      client.close();
    }
  };

  myDB.updateHome = async function (home) {
    const client = MongoClient(uri, { useUnifiedTopology: true });
    try {
      await client.connect();
      const db = client.db(dbName);
      const col = db.collection(colName);

      return await col.updateOne(
        { _id: ObjectId(home._id) },
        {
          $set: {
            homeType: home.homeType,
            bedrooms: +home.bedrooms,
            bathrooms: +home.bathrooms,
            interiorArea: +home.interiorArea,
            lot: +home.lot,
          },
        }
      );
    } finally {
      client.close();
    }
  };

  myDB.deleteHome = async function (home) {
    const client = MongoClient(uri, { useUnifiedTopology: true });
    try {
      await client.connect();
      const db = client.db(dbName);
      const col = db.collection(colName);

      return await col.deleteOne({ _id: ObjectId(home._id) });
    } finally {
      client.close();
    }
  };

  return myDB;
}

module.exports = myDB();
