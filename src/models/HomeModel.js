const mongoose = require('mongoose');

/* obj com a config do schema*/
const HomeSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  descricao: String
});

const HomeModel = mongoose.model('Home', HomeSchema);

//validaDados
class Home {

}

module.exports = Home;