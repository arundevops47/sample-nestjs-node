import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection, getConnectionOptions } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from './users/users.module';
import { CommonModule } from './common/common.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';
import { TaxesModule } from './taxes/taxes.module';
import { TagsModule } from './tags/tags.module';
import { TypesModule } from './types/types.module';
import { AuthModule } from './auth/auth.module';
import { StoreModule } from './stores/store.module';
import { FilesModule } from './files/files.module';
import { TestModule } from './test/test.module';
import { UserModule } from './user/user.module';


import { OrderEntity } from 'src/database/entities/order.entity';
import { ProductEntity } from 'src/database/entities/product.entity';
import { RoleEntity } from 'src/database/entities/role.entity';
import { StoreEntity } from 'src/database/entities/store.entity';
import { TagEntity } from 'src/database/entities/tag.entity';
import { UserEntity } from 'src/database/entities/user.entity';

@Module({
  imports: [
    UsersModule,
    CommonModule,
    ProductsModule,
    OrdersModule,
    TaxesModule,
    TagsModule,
    TypesModule,
    AuthModule,	
		StoreModule, 
		FilesModule,
		TestModule, 
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME },
    }),   	 		
		ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
        PORT: Joi.number().default(5000),				
				APP_URL: Joi.string().required(),
				ADMIN_URL: Joi.string().required(),
				STORE_URL: Joi.string().required(),
				SOCIAL_URL: Joi.string().required(),				
				JWT_SECRET: Joi.string().required(),
				JWT_EXPIRATION_TIME: Joi.string().required().default("1d"),
				SALT_OR_ROUND:Joi.number().default(10).required(),
				DB_CONNECTION: Joi.string().required().default("mysql"),
				DB_HOST: Joi.string().required().default("localhost"),
				DB_PORT: Joi.number().required().default(3306),
				DB_USERNAME: Joi.string().required().default('root'),
				DB_PASSWORD: Joi.string().required(),
				DB_DATABASE: Joi.string().required(),
				MAIL_HOST: Joi.string().required(),
				MAIL_PORT: Joi.number().required(),
				MAIL_USERNAME: Joi.string().required(),
				MAIL_PASSWORD: Joi.string().required(),
				AWS_REGION: Joi.string().required(),
				AWS_ACCESS_KEY_ID: Joi.string().required(),
				AWS_SECRET_ACCESS_KEY: Joi.string().required(),				
				AWS_BUCKET_NAME: Joi.string().required(),	
      }),		
			isGlobal: true,
			// 	envFilePath: '.env',
    }), 
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_DATABASE,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      entities: [OrderEntity, ProductEntity, RoleEntity, StoreEntity, TagEntity, UserEntity],
			synchronize: false,
			logging: false,
      cli: {
				entitiesDir: 'src/database/entities',
				migrationsDir: "src/database/migrations",
				subscribersDir: "src/database/subscribers"
      },		
			migrations: ['/src/database/migrations/*{.ts,.js}'],	
    }), 
		UserModule, 
  ],
  controllers: [],
})
export class AppModule {
	constructor(private connection: Connection) {}
}
