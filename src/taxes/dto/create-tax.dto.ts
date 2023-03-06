import { OmitType } from '@nestjs/swagger';
import { Tax } from '../entities/tax.entity';

export class CreateTaxDto extends OmitType(Tax, [
  'id',
  'createdAt',
  'updatedAt',
]) {}
