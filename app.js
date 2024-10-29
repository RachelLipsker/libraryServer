const express = require("express");
const chalk = require("chalk");
require("dotenv").config();
const config = require("config");

const connectToDb = require("./DB/dbService");
const corsMiddleware = require("./middlewares/cors");
const loggerMiddleware = require("./logger/loggerService");
const { handleError } = require("./utils/handleErrors");
const router = require("./router/router");
const ENVIRONMENT = config.get("ENVIRONMENT");

const app = express();
const PORT = process.env.PORT || 8181;

app.use(corsMiddleware);
app.use(express.json());
app.use(loggerMiddleware());
app.use(express.static("./public"));

app.use(router);

app.use((err, req, res, next) => {
    return handleError(res, 500, "internal error of the server")
});

app.listen(PORT, () => {
    console.log(chalk.yellow("server is listening to port " + PORT));
    connectToDb();
    // if (ENVIRONMENT == "development") {
    //     insertInitialData();
    // }
});