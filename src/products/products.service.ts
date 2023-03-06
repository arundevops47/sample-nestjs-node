import Fuse from 'fuse.js';
import { v4 as uuid } from 'uuid';
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { validate } from "class-validator";
import { CreateProductDto } from './dto/create-product.dto';
import { GetProductsDto, ProductPaginator } from './dto/get-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { paginate } from 'src/common/pagination/paginate';
import { GetPopularProductsDto } from './dto/get-popular-products.dto';
import { ProductEntity } from 'src/database/entities/product.entity';
import { ProductCategoryEntity } from 'src/database/entities/product-category.entity';
import { ProductGalleryEntity } from 'src/database/entities/product-gallery.entity';
import { ProductTagEntity } from 'src/database/entities/product-tag.entity';
import { ProductVariationEntity } from 'src/database/entities/product-variation.entity';
import { ProductVariationOptionEntity } from 'src/database/entities/product-variation-option.entity';
import ajv from "ajv";

const options = {
  keys: ['name', 'group.slug', 'categories.slug', 'status', 'storeId'],
  threshold: 0.1,
	// threshold: 0.3,
};

@Injectable()
export class ProductsService {
  private products: ProductEntity[];
	logger: Logger;

	constructor(
    @InjectRepository(ProductEntity)
    private productRepo: Repository<ProductEntity>,		
		@InjectRepository(ProductGalleryEntity)
    private productGalleryRepo: Repository<ProductGalleryEntity>,		
		@InjectRepository(ProductVariationEntity)
    private productVariationRepo: Repository<ProductVariationEntity>,			
		@InjectRepository(ProductCategoryEntity)
    private productCategoryRepo: Repository<ProductCategoryEntity>,				 
		@InjectRepository(ProductTagEntity)
    private productTagRepo: Repository<ProductTagEntity>,			
		@InjectRepository(ProductVariationOptionEntity)
    private productVariationOptionRepo: Repository<ProductVariationOptionEntity>,			
	) {
		this.logger = new Logger();
	}

  async getProducts({ limit, page, search }: GetProductsDto): Promise<ProductPaginator> {
    if (!page) page = 1;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

		this.products = await this.productRepo.find({
			relations: ['store', 'image', 'orders', 'group', 'gallery', 'categories','tags', 'variations', 'variations.attribute', 'variationOptions']
    });

		this.products = plainToClass(ProductEntity, this.products);
		const fuse = new Fuse(this.products, options);

    let data: ProductEntity[] = this.products;
    if (search) {
      const parseSearchParams = search.split(';');
      for (const searchParam of parseSearchParams) {
        const [key, value] = searchParam.split(':');
        data = fuse.search(value)?.map(({ item }) => item);
      }
    }

    const results = data.slice(startIndex, endIndex);
    const url = `/products?search=${search}&limit=${limit}`;

    return {
			status: 200,
			data: results,
			...paginate(data.length, page, limit, results.length, url),
		}
  }

  async getProductBySlug(slug: string): Promise<ProductEntity> {
		const product = await this.productRepo.findOne({slug: slug},{
			relations: ['store', 'image', 'orders', 'group', 'gallery', 'categories','tags', 'variations', 'variations.attribute', 'variationOptions']
    });

		return {
			...product,
		};			
  }
	
  getPopularProducts({ storeId, limit }: GetPopularProductsDto): ProductEntity[] {
    return this.products?.slice(0, limit);
  }
	
  async create(createProductDto: CreateProductDto) {
		let product = await this.productRepo.findOne({sku: createProductDto.sku});
		if(product) {
			return {
				status: 400,
				msg: 'Product sku already exist',
			}; 
		}

		let slug = `${uuid()}-${createProductDto.name.replace(/\s+/g, '-').toLowerCase()}`;
		
		product = new ProductEntity();
		product.storeId = createProductDto.storeId;
		product.name = createProductDto.name;
		product.description = createProductDto.description;
		product.imageId = createProductDto.image.id;
		product.slug = slug;
		product.sku = createProductDto.sku;
		product.groupId = createProductDto.groupId;
		product.unit = createProductDto.unit;
		product.quantity = createProductDto.quantity;
		product.price = createProductDto.price;
		product.salePrice = createProductDto.salePrice;
		product.productType = "simple";
		product.status = createProductDto.status;
		product.length = createProductDto.length;
		product.height = createProductDto.height;
		product.width = createProductDto.width;

		let productResult: ProductEntity;
		productResult = await this.productRepo.save(product);

		if(productResult) {				
			// save product category
			if(createProductDto.categories != undefined) {
				for(let i=0;i<createProductDto.categories.length;i++) {
					let categoryData = {
						productId: productResult.id,
						categoryId: createProductDto.categories[i],
					}
		
					await this.productCategoryRepo.save(categoryData);
				}
			}
	
			// save product tags
			if(createProductDto.tags != undefined && createProductDto.tags.length) {			
				for(let i=0;i<createProductDto.tags.length;i++) {
					let tagData = {
						productId: productResult.id,
						tagId: createProductDto.tags[i],
					}
		
					await this.productTagRepo.save(tagData);
				}
			}
	
			// save product gallery
			if(createProductDto.gallery != undefined && Object.keys(createProductDto.gallery).length) {
				let gallery = createProductDto.gallery;
				
				for(let i=0;i<gallery.length;i++) {
					let galleryData = {
						productId: productResult.id,
						imageId: gallery[i].id,
						type: 'gallery',
					}
		
					await this.productGalleryRepo.save(galleryData);
				}
			}
	
			if(createProductDto.productType == 'variable') {
				// save product variation
				if(createProductDto.variations.length) {				
					for(let i=0;i<createProductDto.variations.length;i++) {
						let variationData = {
							productId: productResult.id,
							attributeValueId: createProductDto.variations[i].attributeValueId,
						}
			
						await this.productVariationRepo.save(variationData);
					}
				}
		
				// save product variation options
				let variationOptions = createProductDto.variationOptions.upsert;
				
				if(variationOptions!= undefined) {
					for(let i=0;i<variationOptions.length;i++) {	
						let variationOptionData = {
							productId: productResult.id,
							title: variationOptions[i].title,
							sku: variationOptions[i].sku,
							quantity: variationOptions[i].quantity,
							price: variationOptions[i].price,
							salePrice: variationOptions[i].salePrice,
							isDisable: variationOptions[i].isDisable,
							options: JSON.stringify(variationOptions[i].options),
						}
			
						await this.productVariationOptionRepo.save(variationOptionData);
					}
				}
			}
	
			return {
				status: 200,
				result: productResult,
			}; 
		}
  }

  async update(id: number, updateProductDto: UpdateProductDto) {

		let product = await this.productRepo.findOne({ 
			where: { 
				sku: updateProductDto.sku, 
				id: Not(id)
			}  
		});

		if(product) {
			return {
				status: 400,
				msg: 'Product sku already exist.',
			}; 
		}

		product = await this.productRepo.findOne({id: id},{
      relations: ['store', 'image', 'gallery', 'group', 'orders', 'categories', 'tags',  'variations', 'variations.attribute', 'variationOptions']
    });

		const productData = {
			storeId: updateProductDto.storeId,
			name: updateProductDto.name,
			description: updateProductDto.description,
			imageId: updateProductDto.image.id,
			sku: updateProductDto.sku,
			groupId: updateProductDto.groupId,
			unit: updateProductDto.unit,
			quantity: updateProductDto.quantity,
			price: updateProductDto.price,
			salePrice: updateProductDto.salePrice,
			productType: updateProductDto.productType,
			status: updateProductDto.status,
			length: updateProductDto.length,
			height: updateProductDto.height,
			width: updateProductDto.width,
		}

		await this.productRepo.update( id , productData);

		// update product category
		await this.productCategoryRepo.delete({ productId: id });  
		for(let i=0;i<updateProductDto.categories.length;i++) {
			let categoryData = {
				productId: id,
				categoryId: updateProductDto.categories[i],
			}

			await this.productCategoryRepo.save(categoryData);
		}

		// save product tags
		await this.productTagRepo.delete({ productId: id });  
		if(updateProductDto.tags.length) {
			for(let i=0;i<updateProductDto.tags.length;i++) {
				let tagData = {
					productId: id,
					tagId: updateProductDto.tags[i],
				}
	
				await this.productTagRepo.save(tagData);
			}
		}

		// save product gallery
		await this.productGalleryRepo.delete({ productId: id });  
		if(updateProductDto.gallery.length) {
			for(let i=0;i<updateProductDto.gallery.length;i++) {
				let galleryData = {
					productId: id,
					imageId: updateProductDto.gallery[i].id,
				}
				await this.productGalleryRepo.save(galleryData);
			}		
		}

		if(updateProductDto.productType == 'simple' && product.productType == 'variable') {
			await this.productVariationRepo.delete({ 
				productId: product.id
			});  

			await this.productVariationOptionRepo.delete({ 
				productId: product.id
			});  
		}

		if(updateProductDto.productType == 'variable') {
			await this.productVariationRepo.delete({ 
				productId: product.id
			});  

			// save product variation
			if(updateProductDto.variations.length) {				
				for(let i=0;i<updateProductDto.variations.length;i++) {
					let variationData = {
						productId: id,
						attributeValueId: updateProductDto.variations[i].attributeValueId,
					}
		
					await this.productVariationRepo.save(variationData);
				}
			}
	
			// save product variation options
			let variationOptions = updateProductDto.variationOptions.upsert;
			if(variationOptions!= undefined) {
				await this.productVariationOptionRepo.delete({ 
					productId: product.id
				});  

				for(let i=0;i<variationOptions.length;i++) {

					let variationOptionData = {
						productId: id,
						title: variationOptions[i].title,
						sku: variationOptions[i].sku,
						quantity: variationOptions[i].quantity,
						price: variationOptions[i].price,
						salePrice: variationOptions[i].salePrice,
						isDisable: variationOptions[i].isDisable,
						options: JSON.stringify(variationOptions[i].options),
					}
		
					await this.productVariationOptionRepo.save(variationOptionData);
				}
			}
		}

    return product;
  }

  async remove(id: number) {
		await this.productRepo.delete({ id: id });  
    return `Product deleted successfully`;
  }
}
