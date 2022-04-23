




var config={
    db:{
        host: 'host',
username: 'username',
password: 'password',
database: 'database',
port: 5432 ,
  ssl: {
    rejectUnauthorized: false,
       },
       idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
    }
   }

   module.exports = config; 
   
