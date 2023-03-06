import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { v4 as uuid } from 'uuid';
import { S3 } from 'aws-sdk';
import { FileEntity } from 'src/database/entities/file.entity';

@Injectable()
export class FilesService {
	constructor(
		@InjectRepository(FileEntity)
		private fileRepo: Repository<FileEntity>,
		private readonly configService: ConfigService
	) { }

	async uploadPublicFile(fileBuffer) {

		let response = [];
		for(let i = 0;i < fileBuffer.length; i++) {
			console.log('fileBuffer ', fileBuffer[i])

			let uploadResult = await this.uploadS3(fileBuffer[i].buffer, fileBuffer[i].originalname);
			let isImage = fileBuffer[i].mimetype.includes("image");

			let fileTypes = this.getS3DefaultFile();
			let thumbnails = !isImage ? fileTypes.find(o => o.type == 'file').url : uploadResult.Location;

			let newFile = this.fileRepo.create({
				name: fileBuffer[i].originalname,
				size: fileBuffer[i].size,
				mimeType: fileBuffer[i].mimetype,
				key: uploadResult.Key,
				url: uploadResult.Location,
				thumbnail: thumbnails,
			});
	
			let result = await this.fileRepo.save(newFile);

			response.push({
				id: result.id,
				name: result.name,
				size: fileBuffer[i].size,
				mimeType: fileBuffer[i].mimetype,
				url: result.url,
				thumbnail: result.thumbnail,
			});
		}	

		return response;
	}

	async uploadS3(fileBuffer, filename:string) {
		const s3 = this.getS3();

		const params = {
			Bucket: this.configService.get('AWS_BUCKET_NAME')+'/public',
			Body: fileBuffer,
			Key: `${uuid()}-${filename}`,
			ACL: "public-read",
			// ContentType: mimetype,
			ContentDisposition:"inline",
			// CreateBucketConfiguration: 
			// {
			// 		LocationConstraint: "ap-south-1"
			// }
		};

		const uploadResult = await s3.upload(params).promise();

		return uploadResult;

		// return new Promise((resolve, reject) => {
		// 	s3.upload(params, (err, data) => {
		// 		if (err) {
		// 			Logger.error(err);
		// 			reject(err.message);
		// 		}
		// 		resolve(data);
		// 	});
		// });
	}

	getS3() {
		return new S3({
			accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
			secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
		});
	}

	getS3DefaultFile() {
		return [
			{type: 'file', url: 'https://fly-andreas.s3.ap-south-1.amazonaws.com/static/file.png',},
			{type: 'image', url: 'https://fly-andreas.s3.ap-south-1.amazonaws.com/static/img.png'},
			{type: 'pdf', url: 'https://fly-andreas.s3.ap-south-1.amazonaws.com/static/pdf.png'},
			{type: 'doc', url: 'https://fly-andreas.s3.ap-south-1.amazonaws.com/static/doc.png'},
			{type: 'csv', url: 'https://fly-andreas.s3.ap-south-1.amazonaws.com/static/csv.png'},
			{type: 'ppt', url: 'https://fly-andreas.s3.ap-south-1.amazonaws.com/static/ppt.png'},
		];
	}

	blobToFile (theBlob: Blob, fileName:string): File {
    var b: any = theBlob;
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;
    //Cast to a File() type
    return <File>theBlob;
	}

	findAll() {
		return `This action returns all uploads`;
	}

	findOne(id: number) {
		return `This action returns a #${id} upload`;
	}

	remove(id: number) {
		return `This action removes a #${id} upload`;
	}	
}
