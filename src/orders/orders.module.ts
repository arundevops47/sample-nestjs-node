import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersService } from './orders.service';
import { OrdersController, OrderStatusController } from './orders.controller';
import { OrderEntity } from 'src/database/entities/order.entity';

@Module({
	imports: [TypeOrmModule.forFeature([OrderEntity])],
  controllers: [OrdersController, OrderStatusController],
  providers: [OrdersService],
})
export class OrdersModule {}
