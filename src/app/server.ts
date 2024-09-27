import mongoose from "mongoose";
import app from "./app";
import config from "./config";

async function main() {
  let server;
  try {
    await mongoose.connect(config.database__url as string);
    server = app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port} db`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();
