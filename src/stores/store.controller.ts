import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Query,
	Request,
	UseGuards
} from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto, ApproveStoreDto } from './dto/update-store.dto';
import { GetStoresDto, StorePaginator, GetStoresDocumentsDto, StoreDocumentPaginator } from './dto/get-stores.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('stores')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

	@UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createStoreDto: CreateStoreDto, @Request() req) {
    return this.storeService.create(createStoreDto, req);
  }

	@Get('categories')
  async getStoresCategories() {
    return this.storeService.getStoresCategories();
  }

	@UseGuards(JwtAuthGuard)
  @Get()
  async getStores(@Query() query: GetStoresDto, @Request() req): Promise<StorePaginator> {
    return this.storeService.getStores(query, req.user.sub);
  }

  @Get(':slug')
  async getStore(@Param('slug') slug: string) {
    return this.storeService.getStore(slug);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    return this.storeService.update(+id, updateStoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storeService.remove(+id);
  }

  @Post('approve')
  approveStore(@Body() req: ApproveStoreDto) {
    return this.storeService.approve(req);
  }
	
  @Post('disapprove')
  disapproveStore(@Body() req: ApproveStoreDto) {
    return this.storeService.approve(req);
  }	
}

