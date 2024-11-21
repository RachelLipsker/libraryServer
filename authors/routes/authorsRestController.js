const express = require("express");
const { handleError } = require("../../utils/handleErrors");
const { createAuthor, getAuthors, updateAuthor, deleteAuthor } = require("../models/authorsAccessDataService");
const auth = require("../../auth/authService");


const router = express.Router();

router.post("/", auth, async (req, res) => {
    try {
        const userInfo = req.user;
        if (!userInfo.isAdmin) {
            return handleError(res, 403, "Authorization Error: Only admin can add author");
        }

        let author = await createAuthor(req.body)
        res.status(201).send(author);
    } catch (error) {
        handleError(res, error.status || 400, error.message);
    }
});

router.get("/", async (req, res) => {
    try {
        let authors = await getAuthors();
        res.send(authors);
    } catch (error) {
        handleError(res, 400, error.message);
    }
});

router.put("/:id", auth, async (req, res) => {
    try {
        const userInfo = req.user;
        if (!userInfo.isAdmin) {
            return handleError(res, 403, "Authorization Error: Only admin can edit author");
        }

        const newAuthor = req.body;
        const { id } = req.params;
        let author = await updateAuthor(id, newAuthor);
        res.send(author);
    } catch (error) {
        handleError(res, error.status || 400, error.message);
    }
});


router.delete("/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const userInfo = req.user;

        if (!userInfo.isAdmin) {
            return handleError(res, 403, "Authorization Error: Only admin can delete author");
        }

        let author = await deleteAuthor(id);
        res.send(author);
    } catch (error) {
        handleError(res, error.status || 400, error.message);
    }
});

module.exports = router;