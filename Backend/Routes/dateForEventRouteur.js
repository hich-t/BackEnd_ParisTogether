const express = require("express");
const dateForEventRouter = express.Router();
const DateForEvent = require("../models/dateForEventSchema");
const jwt = require("jsonwebtoken");
dateForEventRouter.use(express.json());

dateForEventRouter.get("/dateForEvent/all", async (req, res) => {
  DateForEvent.find()
    .then((event) => res.json(event))
    .catch((err) => res.json(err));
});

dateForEventRouter.get("/dateForEvent/all/:id", async (req, res) => {
  DateForEvent.find({ idEvent: { $in: [req.params.id] } })
    .then((user) => res.json(user))
    .catch((err) => res.json(err));
});

dateForEventRouter.put("/dateForEvent/:id", async (req, res) => {
  let checkToken = jwt.verify(req.headers.authorization, process.env.SECRET);
  let id = checkToken.user._id;

  const datesForId = await DateForEvent.findOne({
    idEvent: req.params.id,
    date: req.body.date,
  });

  if (!datesForId) {
    const dateForEvent = new DateForEvent({
      user: [id],
      idEvent: req.params.id,
      date: req.body.date,
    });
    dateForEvent.save();
    res.send("create");
  } else {
    const checkUserInArray = datesForId.user.includes(id);
    if (checkUserInArray) {
      return res.send("already in your agenda");
    } else {
      datesForId.user.push(id);
      datesForId.save();
      res.send("added to event");
    }
  }
});

module.exports = dateForEventRouter;
