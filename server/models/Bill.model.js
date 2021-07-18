const mongoose = require("mongoose"); // Erase if already required

//Export the model
module.exports = mongoose.model(
  "Bill",
  new mongoose.Schema({
    Fecha: String,
    Hora: String,
    "Precio (€/kWh)": String,
    "Consumo (Wh)": String,
    "Coste por hora (€)": String,
  }),
  "dates"
);
