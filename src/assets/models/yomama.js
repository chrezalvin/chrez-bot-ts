const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: `${__dirname}/../data/yomama.sequelize`
});

exports.yomamas = sequelize.define('yomama', {
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    text: { type: Sequelize.TEXT },
});