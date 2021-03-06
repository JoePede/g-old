if (process.env.BROWSER) {
  throw new Error('Do not import `private_configs.js` from inside the client-side code.');
}

module.exports = {
  development: {
    dbConfig: {
      database: 'database_name',
      user: 'user',
      password: 'password',
      host: '127.0.0.1',
      port: '5432',
    },
    mailer: {
      config: {
        jsonTransport: true, // stream output to console
      },
      sender: '{email address}',
    },
  },
  production: {
    dbConfig: {
      // or dbConfig: process.env.DATABASE_URL,
      database: 'database_name',
      user: 'user',
      password: 'password',
      host: '127.0.0.1',
      port: '5432',
    },
    mailer: {
      config: {
        // https://nodemailer.com/smtp/
        // gmail example, no pooling used!
        host: 'smtp.gmail.com',
        port: 587,
        secure: false, // upgrade later with STARTTLS
        auth: {
          user: '{local-part}@gmail.com',
          pass: 'password',
        },
        sender: '{email address}',
      },
    },
  },
  deploy: {
    url: 'https://git.heroku.com/{name}.git',
    website: 'https://{name}.herokuapp.com/',
  },
  cloudinary: {
    cloud_name: 'cName',
    api_key: '123456',
    api_secret: 'yourSecret',
  },
  // in gold folder open node REPL, type: var wp = require('web-push');wp.generateVAPIDKeys()
  webpush: {
    mail: 'your@emailAdress.com',
    publicKey: '',
    privateKey: '',
  },
};
