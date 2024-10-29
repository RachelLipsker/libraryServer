const express = require("express");

const booksRouterController = require("../books/routes/booksRestConroller");
const auhorsRouterController = require("../authors/routes/authorsRestController")
const genresRouterController = require("../genres/routes/genresRestController")
const usersRouterController = require("../users/routes/usersRestController")
const borrowingsRouterController = require("../borrowings/routes/borrowingsRestController")
const { handleError } = require("../utils/handleErrors");


const router = express.Router();

router.use("/books", booksRouterController);
router.use("/users", usersRouterController);
router.use("/borrowings", borrowingsRouterController);
router.use("/authors", auhorsRouterController);
router.use("/genres", genresRouterController);

router.use((req, res) => {
    handleError(res, 404, "path not found");
})

module.exports = router;