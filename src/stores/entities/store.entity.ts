import { UserAddress } from 'src/addresses/entities/address.entity';
import { Attachment } from 'src/common/entities/attachment.entity';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Location, StoreSocials } from 'src/settings/entities/setting.entity';
import { UserEntity } from 'src/database/entities/user.entity';

export class Store extends CoreEntity {
  ownerId: number;
  owner: UserEntity;
	storeCategoryId: number;
  // slug: string;
  logo?: Attachment;
  coverImage: Attachment;
  name: string;
  description?: string;
	tags?: string;
  address: UserAddress;
  settings?: StoreSettings;
  balance?: Balance;
	socials?: StoreSocials; 
  // orders_count: number;
  // products_count: number;
  // is_active: boolean;
	isVerified: boolean;
  staffs?: UserEntity[];
}

export class Balance {
  id: number;
  adminCommissioRate: number;
  store: Store;
	totalcoins: number;
  totalEarnings: number;
  withdrawnAmount: number;
  currentBalance: number;
  paymentInfo: PaymentInfo;
}

export class PaymentInfo {
  account: string;
  name: string;
  email: string;
  bank: string;
}

export class StoreSettings {
  socials: StoreSocials[];
  contact: string;
  location: Location;
  website: string;
	supportEmail: string;
	supportPhone: string;
}
