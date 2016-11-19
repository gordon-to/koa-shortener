import sequelize from './db';

const makeHash = () => {
      let strLength =  5;
      let charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      const result = [];
      while (--strLength) {
          result.push(charSet.charAt(Math.floor(Math.random() * charSet.length)));
      }
      return result.join('');
  }

const Url = sequelize.define('url', {
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
});

Url.getAndVisit = async (hash) => {
  const url = await Url.findById(hash);
  url.increment('visits');
  return url.longUrl;
}

Url.addUrl = async (longUrl) => {
  let newHash = makeHash();
  while ( await Url.findByPrimary(newHash) ) {
    newHash = makeHash();
  }
  Url.create({hash: newHash, longUrl: longUrl});
  return newHash;
}



export default Url;