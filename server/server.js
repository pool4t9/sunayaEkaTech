const mongoose = require("mongoose");
require("dotenv").config();
const app = require("./app");

const startServer = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATABASE);
    const { PORT, NODE_ENV } = process.env;
    app.listen(PORT, () => {
      console.log(`server is listing in ${NODE_ENV} on ${PORT} `);
      console.log(conn.connection.host);
    });
  } catch (e) {
    console.log(e.message);
    process.exit(1);
  }
};

startServer();
