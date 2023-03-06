import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { v4 as uuid } from 'uuid';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto, ApproveStoreDto } from './dto/update-store.dto';
import Fuse from 'fuse.js';
import { GetStoresDto, StoreDocumentDto, GetStoresDocumentsDto, StoreDocumentResponseDto } from './dto/get-stores.dto';
import { AddStoreDocumentDto } from './dto/add-store-document.dto';
import { paginate } from 'src/common/pagination/paginate';
import { GetStaffsDto } from './dto/get-staffs.dto';
import { UserEntity } from 'src/database/entities/user.entity';
import { StoreCategoryEntity } from 'src/database/entities/store-category.entity';
import { StoreEntity } from 'src/database/entities/store.entity';
import { StoreAddressEntity } from 'src/database/entities/store-address.entity';
import { StoreDocumentEntity } from 'src/database/entities/store-document.entity';
import { StoreSocialEntity } from 'src/database/entities/store_socials.entity';
import { StoreSettingsEntity } from 'src/database/entities/store-settings.entity';
import { ProductEntity } from 'src/database/entities/product.entity';

const options = {
  keys: ['name', 'type.slug', 'isActive'],
  threshold: 0.3,
};

@Injectable()
export class StoreService {
  private stores: StoreEntity[];

	constructor(
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,				
    @InjectRepository(StoreCategoryEntity)
    private storeCategoriesRepo: Repository<StoreCategoryEntity>,		
		@InjectRepository(StoreEntity)
    private storeRepo: Repository<StoreEntity>,					
		@InjectRepository(StoreAddressEntity)
    private storeAddressRepo: Repository<StoreAddressEntity>,			
		@InjectRepository(StoreDocumentEntity)
    private storeDocumentRepo: Repository<StoreDocumentEntity>,			
		@InjectRepository(StoreSocialEntity)
    private storeSocialRepo: Repository<StoreSocialEntity>,			
		@InjectRepository(StoreSettingsEntity)
    private storeSettingsRepo: Repository<StoreSettingsEntity>,			
		@InjectRepository(ProductEntity)
    private productRepo: Repository<ProductEntity>,								 
	) {
	}
	
	async getStoresCategories(): Promise<StoreCategoryEntity[]> {
		let storeCategories = await this.storeCategoriesRepo.find();	
		return storeCategories;
  }

  getStaffs({ storeId, limit, page }: GetStaffsDto) {
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    // let staffs: Store['staffs'] = [];
		let staffs = [];

    const results = staffs?.slice(startIndex, endIndex);
    const url = `/staffs?limit=${limit}`;

    return {
			status: 200,
      data: results,
      ...paginate(staffs?.length, page, limit, results?.length, url),
    };
  }

  async approve(req: ApproveStoreDto) {
		if(req.status == 'approve') {
			let result = await this.storeRepo.update( req.id , { isApproved: true});
		}
		else if(req.status == 'disapprove') {
			let result = await this.storeRepo.update( req.id , { isApproved: false });
		}		
    return `Done`;
  }

  async remove(id: number) {
		await this.storeRepo.delete({ id: id });  
    return `This action removes a #${id} store`;
  }	


	async getStoreDocuments(slug: string): Promise<StoreDocumentResponseDto> {
		let store: StoreEntity = await this.storeRepo
																					.createQueryBuilder('stores')
																					.select(['stores.id', 'stores.slug'])
																					.where({ 
																						slug: slug
																					})
																					.leftJoinAndSelect('stores.documents', 'documents')
																					.getOne();
																		
		let storeDocumentsData: StoreDocumentEntity[] = await this.storeDocumentRepo
														.createQueryBuilder('store_documents')
														.innerJoinAndSelect('store_documents.file', 'file')
														.where({ 
															storeId: store.id
														})
														.getMany();								

		let storeDocuments = storeDocumentsData.reduce((r, a) => {
			r[a.type] = [...r[a.type] || [], a];
			return r;
		}, {});	

		let storeData = new StoreDocumentResponseDto();
		storeData.id = store.id;
		storeData.slug = store.slug;
		storeData.documents = storeDocuments
		
		return storeData;

  }

	async addStoreDocuments(documents: AddStoreDocumentDto, slug) {
		let store = await this.storeRepo.findOne({slug: slug});	

		for (var key in documents) {
			for(let i=0;i<documents[key].length;i++) {
				let document = documents[key];

				const documentData = {
					storeId: store.id,
					fileId: document[i].id,	
					type: key,	
					status: 'processing',
				}
	
				let result = await this.storeDocumentRepo.save(documentData);
			}
		}
		
		return {slug: store.slug};
	}

	async updateStoreDocuments(documents: AddStoreDocumentDto, slug) {

		let store = await this.storeRepo.findOne({slug: slug});	
		let storeDocuments = await this.storeDocumentRepo.find({ 
			storeId: store.id
		});  

		let inputDocuments = [];
		for (var key in documents) {
			let documentArr = documents[key];
			if(documentArr.length > 0) {
				for(let i=0;i<documentArr.length;i++) {
					inputDocuments.push(documentArr[i]);
				}
			}
		}

		// delete file
		for(let i=0;i<storeDocuments.length;i++) {
			let output = inputDocuments.find(e => e.fileId == storeDocuments[i].fileId);
			if(output == undefined) {
				await this.storeDocumentRepo.delete({ id: storeDocuments[i].id });  
			}
		}

		// add new file
		for(let i=0;i<inputDocuments.length;i++) {
			if(inputDocuments[i].fileId == undefined) {
				const documentData = {
					storeId: store.id,
					fileId: inputDocuments[i].id,	
					type: key,	
					status: 'processing',
				}
				let result = await this.storeDocumentRepo.save(documentData);
			}
		}

		return store.slug;
	}

	async changeDocumentStatus(req) {
		if(req.status == 'approve') {
			let result = await this.storeDocumentRepo.update( req.id , { status: 'approved'});
		}
		else if(req.status == 'reject') {
			let result = await this.storeDocumentRepo.update( req.id , { status: 'rejected' });
		}
    return `done`;
  }

}
