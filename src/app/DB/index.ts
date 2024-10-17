import config from "../config";
import { USER_ROLE } from "../modules/auth/auth.constant";
import { User } from "../modules/auth/auth.model";

const superAdmin = {
  name: {
    firstName: "Rashida",
    lastName: "Akter",
  },
  password: config.super__admin__password,
  email: "rashidaakterchadni@gmail.com",
  needsPasswordChange: false,
  role: USER_ROLE.admin,
  contactNo: 12345678901,
  isDeleted: false,
};

const seedSuperAdmin = async () => {
  //when database is connected, we will check is there any user who is super admin
  const isSuperAdminExits = await User.findOne({ role: USER_ROLE.admin });
  if (!isSuperAdminExits) {
    const result = await User.create(superAdmin);
    console.log(result);
  }
};

export default seedSuperAdmin;
