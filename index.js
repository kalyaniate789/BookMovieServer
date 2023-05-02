const express = require("express");
const app = express();
const bodyParser = require("body-parser");
require("dotenv").config();
const port = process.env.PORT;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
const {connection} = require("./connector");
const cors = require("cors");

app.use(cors());

app.use(express.json());

const appRouter = express.Router();
app.use("/api", appRouter);

appRouter.route("/booking").post(async (req, res) => {
  try {
    let dObject = req.body;
    const newBooking = new connection({
      ...req.body,
    });
    const bookingData = await newBooking.save();
    res.status(200).json(bookingData);
  } catch (err) {
    res.send(err.message);
    console.log(err);
  }
});

appRouter.route("/booking").get(async (req, res) => {
  try {
    const bookings = await connection.find().sort({createdAt: 1});
    const lastbooking = bookings[bookings.length - 1];
    if (lastbooking) {
      res.send(lastbooking);
    } else {
      res.send({message: "no previous bookings found "});
    }
  } catch (err) {
    res.send(err.message);
    console.log(err);
  }
});

app.listen(port, () => console.log(`App listening on port ${port}!`));

module.exports = app;
