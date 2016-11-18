'use strict';
import  Sequelize from 'sequelize';

const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 1000
  }
});

export const Url = sequelize.define('url', {
  hash: {
    type: Sequelize.STRING(16),
    unique: true,
    primaryKey: true

  },
  longUrl: {
    type: Sequelize.STRING(2048),
    field: 'long_url',
    notNull: true,
    isUrl: true,
  },
  visits: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
})

export const getAndVisit = async (hash) => {
  const url = await Url.findOne({where: {hash: hash}});
  //url.increment('visits');
  return url.longUrl;
}

export default {}
