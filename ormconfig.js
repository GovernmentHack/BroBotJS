
if (!!process.env.VCAP_SERVICES) {
   const vcap_services = JSON.parse(process.env.VCAP_SERVICES)
   const creds = vcap_services.cleardb.credentials

   module.exports = {
      "name": "default",
      "type": "mysql",
      "host": creds.host,
      "port": creds.port,
      "username": creds.username,
      "password": creds.password,
      "database": creds.name,
      "logging": false,
      "synchronize": false,
      "charset": "utf8mb4",
      "entities": [
         "build/src/entity/**/*{.js,.ts}"
      ],
      "migrations": [
         "build/src/migration/**/*{.js,.ts}"
      ],
      "subscribers": [
         "build/src/subscriber/**/*{.js,.ts}"
      ],
      "cli": {
         "entitiesDir": "src/entity",
         "migrationsDir": "src/migration",
         "subscribersDir": "src/subscriber"
      }
   }
}

else {
   module.exports = {
      "name": "default",
      "type": "mysql",
      "host": "localhost",
      "port": 3306,
      "username": "root",
      "password": "@5trongPassword",
      "database": "brobot_test_db",
      "logging": false,
      "synchronize": false,
      "charset": "utf8mb4",
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
