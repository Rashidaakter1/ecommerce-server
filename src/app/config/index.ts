import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT,
  database__url: process.env.DATABASE__URL,
  bcrypt__saltRound: process.env.BCRYPT__SALTROUND,
  NODE_ENV: process.env.NODE_ENV,
  jwt__access__token: process.env.JWT__ACCESS__TOKEN,
  jwt__access__expires__in: process.env.JWT__ACCESS__EXPIRERS__IN,
  jwt__refresh__token: process.env.JWT__REFRESH__TOKEN,
  jwt__refresh__expires__in: process.env.JWT__REFRESH__EXPIRERS__IN,
  reset__ui__link: process.env.RESET__UI__LINK,
  super__admin__password: process.env.SUPER__ADMIN__PASSWORD,
  ssl__store__id:process.env.SSL__STORE__ID,
  ssl__store__password: process.env.SSL__STORE__PASSWORD,
};
