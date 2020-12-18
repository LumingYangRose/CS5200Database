const redis = require("redis");
const { promisify } = require("util");
// const { runInThisContext } = require("vm");

function myDB() {
  const myDB = {};
  const client = redis.createClient();
  client.on("error", function(error) {
    console.error(error);
  });

  // const zip = 24042;
  // const houses = ["house1", "house2", "house5"];


  myDB.getHomes = async function(page) {
    const pzrange = promisify(client.zrange).bind(client);
    const phgetall = promisify(client.hgetall).bind(client);

    const zips = await pzrange("homes", 0, -1);

    console.log("Got house zips", zips);

    const promises = [];
    for (let zip of zips) {
      promises.push(phgetall("zipCodeLocator:" + zip));
    }

    const homes = await Promise.all(promises);
    console.log("Homes details", homes);

    return homes;

    // const psmembers = promisify(client.smembers).bind(client);
    // console.log("Getting houses for zipcode", zip);
    // const res = await psmembers("zipCodeLocator:" + zip);
    // console.log("houses got!", res);
  };


  myDB.createHome = async function(home) {
    // const pincr = promisify(client.incr).bind(client);
    const phmset = promisify(client.hmset).bind(client);
    const pzadd = promisify(client.zadd).bind(client);

    // home.id = await pincr("countHomeId")
    await phmset("zipCodeLocator:" + home.zipCode, home);
    // console.log("Adding houses for zipcode", zip, " houses= ", houses);
    return pzadd("homes", +new Date(), home.zipCode);
    // console.log("houses added!", res);
  };

  myDB.updateHome = async function(home) {
    const phmset = promisify(client.hmset).bind(client);
    return phmset("zipCodeLocator:" + home.zipCode, home);
  }

  myDB.deleteHome = async function(home) {
    const pdel = promisify(client.del).bind(client);
    const pzrem = promisify(client.zrem).bind(client);

    await pdel("zipCodeLocator:" + home.zipCode);
    return await pzrem("homes", home.zipCode);
  }

  myDB.searchHome = async function(zip) {
    const pzrange = promisify(client.zrange).bind(client);
    const phgetall = promisify(client.hgetall).bind(client);

    const zips = await pzrange("homes", 0, -1);

    console.log("Got house zips", zips);

    const promises = [];
    for (let aZip of zips) {
      if (aZip === zip) {
        promises.push(phgetall("zipCodeLocator:" + zip));
      }
    }

    const homes = await Promise.all(promises);
    console.log("Homes details", homes);

    return homes;
  }

  return myDB;

}

module.exports = myDB();

// async function runIt() {
//   const myDB = MyRedisDB();
//   await myDB.addHousestoZip(1234, ["a", "b", "c"]);
//   console.log("houses for 1234", await myDB.getHouses(1234));
// }

// runIt();
