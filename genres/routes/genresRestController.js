const express = require("express");
const { createGenre, getGenres, updateGenre, deleteGenre } = require("../models/genresAccessDataService");
const { handleError } = require("../../utils/handleErrors");
const auth = require("../../auth/authService");


const router = express.Router();

router.post("/", auth, async (req, res) => {
    try {
        const userInfo = req.user;
        if (!userInfo.isAdmin) {
            return handleError(res, 403, "Authorization Error: Only admin can add genre");
        }

        let genre = await createGenre(req.body)
        res.status(201).send(genre);
    } catch (error) {
        handleError(res, error.status || 400, error.message);
    }
});


router.get("/", async (req, res) => {
    try {
        let genres = await getGenres();
        res.send(genres);
    } catch (error) {
        handleError(res, 400, error.message);
    }
});

router.put("/:id", auth, async (req, res) => {
    try {
        const userInfo = req.user;
        if (!userInfo.isAdmin) {
            return handleError(res, 403, "Authorization Error: Only admin can edit genre");
        }

        const newGenre = req.body;
        const { id } = req.params;
        let genre = await updateGenre(id, newGenre);
        res.send(genre);
    } catch (error) {
        handleError(res, error.status || 400, error.message);
    }
});


router.delete("/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const userInfo = req.user;

        if (!userInfo.isAdmin) {
            return handleError(res, 403, "Authorization Error: Only admin can delete genre");
        }

        let genre = await deleteGenre(id);
        res.send(genre);
    } catch (error) {
        handleError(res, 400, error.message);
    }
});

module.exports = router;