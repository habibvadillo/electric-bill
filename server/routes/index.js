const router = require("express").Router();
const Bills = require("../models/Bill.model");

router.get("/", (req, res, next) => {
  res.json("All good in here");
});

/* Create new bill */
router.post("/newbill", (req, res, next) => {
  Bills.create({})
    .then(() => {})
    .catch(() => {});
});

/* Edit bill */
router.patch("/editbill/:id", (req, res, next) => {
  let { price, consumption, cost } = req.body;
  console.log(req.body);
  Bills.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        "Precio (€/kWh)": price,
        "Consumo (Wh)": consumption,
        "Coste por hora (€)": cost,
      },
    },
    { new: true }
  )
    .then((response) => {
      console.log(response, "this is the response");
      res.status(200).json(response);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

/* Get all bills */
router.get("/bills", (req, res, next) => {
  console.log(Bills);
  Bills.find({})
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      res.status(500).send("Something went wrong!");
    });
});

module.exports = router;
