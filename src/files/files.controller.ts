import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FilesService } from './files.service';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @UseInterceptors(FilesInterceptor('attachment[]'))
	uploadFile(@UploadedFiles() attachment: Array<Express.Multer.File>) {
		console.log('attachment ', attachment)
		return this.filesService.uploadPublicFile(attachment);
  }	
}
