const router = require("express").Router();
const Dates = require("../models/Date.model");

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

router.post("/newdate", (req, res, next) => {
  Dates.create({
    Hora: 200,
  })
    .then(() => {})
    .catch(() => {});
});

// You put the next routes here 👇
router.get("/dates", (req, res, next) => {
  console.log(Dates);
  Dates.find({})
    .then((response) => {
      console.log(response);
      res.json(response);
    })
    .catch(() => {});
});
module.exports = router;
