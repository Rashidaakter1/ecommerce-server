import mongoose from "mongoose";
import app from "./app";
import config from "./config";
import seedSuperAdmin from "./DB";
import { Server } from "http";

let server: Server;
async function main() {
  try {
    await mongoose.connect(config.database__url as string);
    seedSuperAdmin();
    server = app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port} db`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();

//For  asynchronous  function
process.on("unhandledRejection", () => {
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// This is for synchronous function
process.on("uncaughtException", () => {
  process.exit(1);
});
