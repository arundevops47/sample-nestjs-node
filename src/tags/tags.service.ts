import { v4 as uuid } from 'uuid';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'src/common/pagination/paginate';
import { CreateTagDto } from './dto/create-tag.dto';
import { GetTagsDto } from './dto/get-tags.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { TagEntity } from 'src/database/entities/tag.entity';
import Fuse from 'fuse.js';

const options = {
  keys: ['name', 'group.slug'],
  threshold: 0.3,
};

@Injectable()
export class TagsService {
  private tags: TagEntity[];

	constructor(
    @InjectRepository(TagEntity)
    private tagsRepo: Repository<TagEntity>,							
	) {
	}

	findAll({ page, limit }: GetTagsDto) {
    if (!page) page = 1;
    const url = `/tags?limit=${limit}`;
    return {
      data: this.tags,
      ...paginate(this.tags.length, page, limit, this.tags.length, url),
    };
  }

  async findOne(id: number) {
		console.log('findOne tags');

		let tag = await this.tagsRepo.findOne(id, {
      relations: ['image', 'group']
    });

		return tag;
  }

	async getAllTags() {
    this.tags = await this.tagsRepo.find({
      relations: ['image', 'group']
    });
		
		return this.tags;
	}

	async getTags({ search, limit, page }: GetTagsDto) {
		if (!page || typeof page == 'string') page = 1;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    this.tags = await this.tagsRepo.find({
      relations: ['image', 'group']
    });

		const fuse = new Fuse(this.tags, options);

    let data: TagEntity[] = this.tags;
		
    if (search) {
      const parseSearchParams = search.split(';');
      for (const searchParam of parseSearchParams) {
        const [key, value] = searchParam.split(':');
        // data = data.filter((item) => item[key] === value);
        data = fuse.search(value)?.map(({ item }) => item);
      }
    }

    // if (text?.replace(/%/g, '')) {
    //   data = fuse.search(text)?.map(({ item }) => item);
    // }
    // if (hasGroup) {
    //   data = fuse.search(hasGroup)?.map(({ item }) => item);
    // }

    const results = data.slice(startIndex, endIndex);
    const url = `/tags?search=${search}&limit=${limit}`;

    return {
      data: results,
      ...paginate(data.length, page, limit, results.length, url),
    };
  }

	async getTag(id: number): Promise <TagEntity> {
		let tag = await this.tagsRepo.findOne(id,{
      relations: ['image', 'group']
    });

    return tag;
  }

  async create(createTagDto: CreateTagDto) {
		var slug = createTagDto.name;
		slug = `${uuid()}-${slug.replace(/\s+/g, '-').toLowerCase()}`;

		const data = {
			name: createTagDto.name,
			icon: createTagDto.icon,
			slug: slug,
			details: createTagDto.details,
			groupId: createTagDto.groupId,
			imageId: createTagDto.image != undefined ? createTagDto.image.id : null
		}

		const createdTag = await this.tagsRepo.save(data);

    return createdTag;
  }

  async update(id: number, updateTagDto: UpdateTagDto) {
		const data = {
			name: updateTagDto.name,
			icon: updateTagDto.icon,
			details: updateTagDto.details,
			groupId: updateTagDto.groupId,
			imageId: updateTagDto.image.id
		}

		await this.tagsRepo.update(id , data);

		let tag = await this.tagsRepo.findOne(id,{
      relations: ['image', 'group']
    });

    return tag;
  }

  remove(id: number) {
    return `This action removes a #${id} tag`;
  }
}
