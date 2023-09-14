import { join } from 'path';

export default () => ({
  env: process.env.NODE_ENV,
  port: +process.env.PORT || 3000,
  database: () => {
    const info = {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT, 10) || 27017,
      dbName: process.env.DB_NAME || 'demo',
      username: process.env.DB_USERNAME || 'chienzxzx33',
      password: process.env.DB_PASSWORD || 'chienbhvt19',
    };
    return {
      uri: `mongodb+srv://${info.username}:${info.password}@nestjs.icpdemp.mongodb.net/?retryWrites=true&w=majority`,
      // uri: `mongodb://${info.username}:${info.password}@${info.host}:${info.port}/${info.dbName}?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false`,
    };
  },
  jwt: {
    secret: 'chienbhvt19',
    accessTokenActiveExpireTime:
      +process.env.ACTIVE_USER_EXPIRE_TIME || 1000 * 60 * 60 * 24 * 100,
    accessTokenExpireTime: process.env.JWT_ACCESS_EXPIRATION_TIME || '15d',
    refreshTokenExpireTime: process.env.JWT_REFRESH_EXPIRATION_TIME || '30d',
  },
  graphQL: {
    autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
  },
  email: {
    host: process.env.MAILDEV_HOST,
    port: process.env.MAILDEV_PORT,
    user: process.env.MAILDEV_INCOMING_USER,
    pass: process.env.MAILDEV_INCOMING_PASS,
    sender: process.env.MAILDEV_SENDER,
  },
  clientDomain: process.env.CLIENT_DOMAIN,
});
