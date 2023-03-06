import { Injectable } from '@nestjs/common';

@Injectable()
export class TestService {

	async getResult() {
		return { msg: 'done' };
  }

}
