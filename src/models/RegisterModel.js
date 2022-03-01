const mongoose = require('mongoose');
const validator = require('validator');
const bcryptjs = require('bcryptjs');

/* obj com a config do schema do banco de dados*/
const RegisterSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true }
});

const RegisterModel = mongoose.model('Register', RegisterSchema);

//validaDados
class Register {
  constructor(body) {//esse body são os campos do formulario que foram recebidos no POST do formulário
    this.body = body;
    this.errors = [];
    this.user = null;
  }

  async login() {
    this.valida();
    if (this.errors.length > 0) return;
    this.user = await RegisterModel.findOne({ email: this.body.email });

    if (!this.user) {
      this.errors.push('Usuário não existe');
      return;
    };

    if (!bcryptjs.compareSync(this.body.password, this.user.password)) {
      this.errors.push('Senha inválida');
      this.user = null;
      return;
    }
  }

  async register() {//já que esse metodo é async tudo que ele retorna é uma promisse então em registerControler tem que virar async tbm
    this.valida();
    if (this.errors.length > 0) return;

    await this.userExists();

    if (this.errors.length > 0) return;

    // aplica hash na senha do usuário
    const salt = bcryptjs.genSaltSync(12);// 12 é meio lento, hoje em dia se for senha de usuário comum e não for sistema que exiga extrema segurança botar 10 ta bom nesse caso se n botar 10 é o default// wikipedia: (salt em inglês) é um dado aleatório que é usado como uma entrada adicional para uma função unidirecional que "quebra" os dados
    this.body.password = bcryptjs.hashSync(this.body.password, salt);

    this.user = await RegisterModel.create(this.body);
  }

  //vê se o usuário a ser registrado já está logado na base de dados
  async userExists() {
    this.user = await RegisterModel.findOne({ email: this.body.email });
    if (this.user) this.errors.push('Usuário já existe.');
  }

  valida() {
    this.cleanUp();
    // Validação
    // O email-precisa ser válido
    if (!validator.isEmail(this.body.email)) this.errors.push('E-mail Inválido');
    // A senha precisa ter entre 3 e 50 caracteres
    if (this.body.password.length < 3 || this.body.password.length > 50) {
      this.errors.push('A senha precisa ter entre 3 e 50 caracteres.');
    }
  }
  // cleanUp() formata o objeto não passando o scrfToken para o banco de dados
  cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== 'string') {
        this.body[key] = '';
      }
    }

    this.body = {
      email: this.body.email,
      password: this.body.password
    };
  }
}

module.exports = Register;
