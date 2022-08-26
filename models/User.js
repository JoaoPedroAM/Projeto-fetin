const bcrypt = require("bcrypt");
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize('fetin', 'root', 'root', {
  host: "localhost",
  port: 3306,
  dialect: "mysql"
});

let User = sequelize.define("users", {
  id: {
    type: Sequelize.INTEGER,
    unique: true,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  primaryName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lastName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      isEmail: { msg: "Email invalido" },
      notEmpty: {
        msg: "O campo email precisa ser preenchido",
      },
      notNull: {
        msg: "O campo email precisa ser preenchido",
      },
    },
  },
  celNumber: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [0, 11],
        msg: "O campo telefone precisa ser preenchido",
      },
    },
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "O campo senha precisa ser preenchido",
      },
      notNull: {
        msg: "O campo senha precisa ser preenchido",
      },
    },
  },
  idEstudantil: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: "O campo Id Estudantil precisa ser preenchido",
      },
      notNull: {
        msg: "O campo Id Estudantil precisa ser preenchido",
      },
    },
  },
  cnh: {
    type: Sequelize.STRING,
  },
});

User.beforeCreate((user, options) => {
  const salt = bcrypt.genSaltSync();
  user.password = bcrypt.hashSync(user.password, salt);
});

User.prototype.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

sequelize.sync().then(() =>
console.log("user tables has been successfully created if one does not exist"))
.catch((error) => console.log(error)
);

module.exports = User;
