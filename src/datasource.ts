import { DataSource } from 'typeorm';
import { User } from './users/entities/user.entity.js';
import { VerificationCode } from './auth/entities/verification-code.entity.js';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  username: process.env.PG_USERNAME,
  database: process.env.PG_DATABASE,
  synchronize: false,
  migrations: [process.env.PROJECT_ROOT_DIR + '/src/migrations/**/*{.js,.ts}'],
  migrationsRun: true,
  entities: [User, VerificationCode],
});

export default dataSource;