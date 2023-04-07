const {Sequelize} = require('sequelize');
const sequelize =  new Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    storage: '../data/schedule.sqlite',
});

module.exports = sequelize.define('schedule', {
    id: { type: Sequelize.INTEGER, primaryKey: true },
    channel: {type: Sequelize.STRING},
    cron: {type: Sequelize.STRING},
    timeZone: {type: Sequelize.STRING},
    title: { type: Sequelize.STRING },
    description: { type: Sequelize.TEXT },
    footer: { type: Sequelize.STRING, allowNull: true },
});