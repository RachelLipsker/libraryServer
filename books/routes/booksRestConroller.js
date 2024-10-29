const express = require("express");
const auth = require("../../auth/authService");
const { createBook, getBooks, getBook, updateBook, deleteBook, orderBook, likeBook, resetOrders } = require("../models/booksAccessDataService");
const { handleError } = require("../../utils/handleErrors");
const { validateCreateBook, validateEditBook } = require("../validation/bookValidationService");



const router = express.Router();


router.post("/", auth, async (req, res) => {
    try {
        const userInfo = req.user;
        if (!userInfo.isAdmin) {
            return handleError(res, 403, "Authorization Error: Only admin can create book");
        };

        const error = validateCreateBook(req.body);
        if (error) return handleError(res, 400, `Joi Error: ${error}`);

        let book = await createBook(req.body);
        res.send(book);
    } catch (error) {
        handleError(res, 400, error.message);
    }
});

router.get("/", async (req, res) => {
    try {
        let books = await getBooks();
        res.send(books);
    } catch (error) {
        handleError(res, 400, error.message);
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        let book = await getBook(id);
        res.send(book);
    } catch (error) {
        handleError(res, 400, error.message);
    }
});


router.put("/:id", auth, async (req, res) => {
    try {
        const userInfo = req.user;
        const newBook = req.body;
        const { id } = req.params;
        if (!userInfo.isAdmin) {
            return handleError(
                res,
                403,
                "Authorization Error: Only admin can edit book"
            );
        };

        const errorMessage = validateEditBook(newBook);
        if (errorMessage !== "") {
            return handleError(res, 400, "Validation error: " + errorMessage);
        };

        let book = await updateBook(id, newBook);
        res.send(book);
    } catch (error) {
        handleError(res, error.status || 400, error.message);
    }
});



router.delete("/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const userInfo = req.user;

        if (!userInfo.isAdmin) {
            return handleError(res, 403, "Authorization Error: Only admin can delete book");
        }

        let book = await deleteBook(id);
        res.send(book);
    } catch (error) {
        handleError(res, 400, error.message);
    }
});


router.patch("/order/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const userInfo = req.user;

        let book = await orderBook(id, userInfo._id);
        res.send(book);
    } catch (error) {
        handleError(res, 400, error.message);
    }
});

router.patch("/like/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const userInfo = req.user;

        let book = await likeBook(id, userInfo._id);
        res.send(book);
    } catch (error) {
        handleError(res, 400, error.message);
    }
});

router.patch("/orders", auth, async (req, res) => {
    try {
        const userInfo = req.user;

        if (!userInfo.isAdmin) {
            return handleError(res, 403, "Authorization Error: Only admin can delete all the orders");
        }
        await resetOrders();
        res.send("all the orders have been reset");
    } catch (error) {
        handleError(res, 400, error.message);
    }
});


module.exports = router;