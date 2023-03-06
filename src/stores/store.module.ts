import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreService } from './store.service';
import { StoreController, StaffsController } from './store.controller';
import { UserEntity } from 'src/database/entities/user.entity';
import { StoreCategoryEntity } from 'src/database/entities/store-category.entity';
import { StoreEntity } from 'src/database/entities/store.entity';
import { StoreAddressEntity } from 'src/database/entities/store-address.entity';
import { StoreDocumentEntity } from 'src/database/entities/store-document.entity';
import { StoreSocialEntity } from 'src/database/entities/store_socials.entity';
import { StoreSettingsEntity } from 'src/database/entities/store-settings.entity';
import { ProductEntity } from 'src/database/entities/product.entity';

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity, StoreCategoryEntity, StoreEntity, StoreAddressEntity, StoreDocumentEntity, StoreSocialEntity, StoreSettingsEntity, ProductEntity])],
  providers: [StoreService],
  controllers: [StoreController, StaffsController]
})
export class StoreModule {}
