import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsService } from './products.service';
import {
  ProductsController,
  PopularProductsController,
} from './products.controller';
import { CategoryEntity } from 'src/database/entities/category.entity';
import { ProductEntity } from 'src/database/entities/product.entity';
import { ProductGalleryEntity } from 'src/database/entities/product-gallery.entity';
import { ProductCategoryEntity } from 'src/database/entities/product-category.entity';
import { ProductTagEntity } from 'src/database/entities/product-tag.entity';
import { ProductVariationEntity } from 'src/database/entities/product-variation.entity';
import { ProductVariationOptionEntity } from 'src/database/entities/product-variation-option.entity';

@Module({
	imports: [TypeOrmModule.forFeature([CategoryEntity, ProductEntity, ProductGalleryEntity, ProductVariationEntity, ProductVariationOptionEntity, ProductCategoryEntity, ProductTagEntity])],
  controllers: [ProductsController, PopularProductsController],
  providers: [ProductsService],
})

export class ProductsModule {}
