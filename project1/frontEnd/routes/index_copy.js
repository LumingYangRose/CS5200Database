const express = require("express");
const router = express.Router();

const myDB = require("../db/myDB.js");
// const myDB = "../db/RealEstate_Luming_bp.db";
//const myDB = require("../db/RealEstate_Luming_bp.db");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.redirect("/homes");
});

router.get("/homes", async (req, res) => {
  const page = req.query.page || 1;
  console.log("/homes", page);

  try {
    const homes = await myDB.getHomes(page);
    // console.log("got homes", homes);
    res.render("homes", {
      homes: homes,
      err: req.session.err,
      msg: req.session.msg,
    });
  } catch (err) {
    console.log("got error", err);
    res.render("homes", { err: err.message, homes: [] });
  }
});

router.post("/homes/delete", async (req, res) => {
  try {
    const home = req.body;
    const { lastID, changes } = await myDB.deleteHome(home.$homeID);

    console.log(lastID, changes);
    if (changes === 0) {
      req.session.err = `Couldn't delete the object ${home.$homeID}`;
      res.redirect("/homes");
      return;
    }

    req.session.msg = "Home deleted";
    res.redirect("/homes");
    return;
  } catch (err) {
    console.log("got error delete");
    req.session.err = err.message;
    res.redirect("/homes");
    return;
  }
});

router.post("/homes/update", async (req, res) => {
  try {
    const home = req.body;
    const db = await myDB.updateHome(home);

    console.log("update", db);

    req.session.msg = "Home Updated";
    res.redirect("/homes");
  } catch (err) {
    console.log("got error update");
    req.session.err = err.message;
    res.redirect("/homes");
  }
});

router.post("/homes/create", async (req, res) => {
  const home = req.body;

  try {
    console.log("Create homes", home);
    await myDB.createHome(home, res);
    req.session.msg = "Home created";
    res.redirect("/homes");
  } catch (err) {
    req.session.err = err.message;
    res.redirect("/homes");
  }
});

module.exports = router;
