
let config = {}

if (!!process.env.VCAP_SERVICES) {
   console.log("***************** using prod ORM config ***********************")

   const vcap_services = JSON.parse(process.env.VCAP_SERVICES)
   const creds = vcap_services.cleardb[0].credentials

   config = {
      "type": "mysql",
      "host": creds.hostname,
      "port": creds.port,
      "username": creds.username,
      "password": creds.password,
      "database": creds.name,
      "logging": false,
      "synchronize": false,
      "charset": "utf8mb4",
      "insecureAuth": true,
      "entities": [
         "src/entity/**/*{.js,.ts}"
      ],
      "migrations": [
         "src/migration/**/*{.js,.ts}"
      ],
      "subscribers": [
         "src/subscriber/**/*{.js,.ts}"
      ],
      "cli": {
         "entitiesDir": "src/entity",
         "migrationsDir": "src/migration",
         "subscribersDir": "src/subscriber"
      }
   }
}

else {
   console.log("***************** using dev ORM config ***********************")

   config = {
      "type": "mysql",
      "host": "localhost",
      "port": 3306,
      "username": "root",
      "password": "@5trongPassword",
      "database": "brobot_test_db",
      "logging": false,
      "synchronize": false,
      "charset": "utf8mb4",
      "insecureAuth": true,
      "entities": [
         "build/src/entity/**/*{.js,.ts}",
      ],
      "migrations": [
         "build/src/migration/**/*{.js,.ts}",
      ],
      "subscribers": [
         "build/src/migration/**/*{.js,.ts}"
      ],
      "cli": {
         "entitiesDir": "src/entity",
         "migrationsDir": "src/migration",
         "subscribersDir": "src/subscriber"
      }
   }
}

module.exports = config