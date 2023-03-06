import { define } from 'typeorm-seeding';

import { UserEntity } from '../../database/entities/user.entity';

define(UserEntity, (faker) => {
  const gender = faker.random.number(1);
  const firstName = faker.name.firstName(gender);
  const lastName = faker.name.lastName(gender);
  const email = faker.internet.email(firstName, lastName);
  const phone = faker.phone.phoneNumber();

  const user = new UserEntity();
  user.firstName = firstName;
  user.lastName = lastName;
  user.email = email;
  user.roleId = 2;
  user.password = 'password';
  user.phone = phone;

  return user;
});
