import path from "path";
import { ConnectionOptions } from "typeorm";
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

const configs: TypeOrmModuleOptions & { seeds: string[]; factories: string[] } =
{
	type: 'mysql',
	host: process.env.DB_HOST,
	port: Number(process.env.DB_PORT),
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	// namingStrategy: new SnakeNamingStrategy(),
	// subscribers: [UserSubscriber],
	synchronize: false,
	entities: ['src/database/**/*.entity{.ts,.js}'],
	migrations: ['src/database/migrations/*{.ts,.js}'],
	seeds: ['src/database/seeds/**/*{.ts,.js}'],
	factories: ['src/database/factories/**/*{.ts,.js}'],
};

module.exports = configs;
