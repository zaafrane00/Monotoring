const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");

// MongoDB connection
const { MONGO_URI } = require("./config");
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

// Define Car schema and model
const carSchema = new mongoose.Schema({
  name: String,
  model: String,
  year: Number
});
const Car = mongoose.model("Car", carSchema);

const app = express();
app.use(express.json());
app.use(morgan("combined")); // Logging with Morgan

// CRUD Endpoints
app.post("/cars", async (req, res) => {
  const { name, model, year } = req.body;
  const car = new Car({ name, model, year });
  await car.save();
  res.status(201).send(car);
});

app.get("/cars", async (req, res) => {
  const cars = await Car.find();
  res.send(cars);
});

app.get("/cars/:id", async (req, res) => {
  const car = await Car.findById(req.params.id);
  res.send(car);
});

app.put("/cars/:id", async (req, res) => {
  const car = await Car.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(car);
});

app.delete("/cars/:id", async (req, res) => {
  await Car.findByIdAndDelete(req.params.id);
  res.status(204).send();
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
