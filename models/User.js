const bcrypt = require('bcrypt')
const Sequelize = require('sequelize')


const sequelize = new Sequelize('fetin', 'root', 'root', {
    host: "localhost",
    port: 3306,
    dialect: "mysql"
  });
  
  let User = sequelize.define("users", {
    idUser: {
      type: Sequelize.INTEGER,
      unique: true,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    firstName: {
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
        
    },
    celNumber: {
      type: Sequelize.STRING,
      allowNull: false,
      
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      
    },
    idEstudantil: {
      type: Sequelize.STRING,
      allowNull: false,
      
    },
    driver: {
      type: Sequelize.BOOLEAN,
    },
  
  });
  
  let Corrida = sequelize.define("corridas", {
    idCorrida: {
      type: Sequelize.INTEGER,
      unique: true,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    starterCity: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    finalCity: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    date: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    time: {
      type: Sequelize.TIME,
      allowNull: true,
  
    },
    price: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    
    },
    
  
  });
  
  
  
  User.hasMany( Corrida, { as: 'corridas' } );
  Corrida.hasOne(Corrida ,{as:"users"})
  
  
  User.beforeCreate((user, options) => {
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(user.password, salt);
  });
  
  User.prototype.validPassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };
  
  sequelize.sync().then(() =>
  console.log("Deu tudo certo"))
  .catch((error) => console.log(error)
  );
   
  exports.User = User;
  exports.Corrida = Corrida;