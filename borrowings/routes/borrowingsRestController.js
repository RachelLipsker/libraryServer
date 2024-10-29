const express = require("express");
const { createBorrwing, returnbook, getBorrowing, getUserBorrowings, getBorrowings, getLateBorrowings, getOpenBorrowings, getLastUserBorrowings } = require("../models/borrowingsAccessDataService");
const { handleError } = require("../../utils/handleErrors");
const auth = require("../../auth/authService");



const router = express.Router();


router.post("/", auth, async (req, res) => {
    try {
        const userInfo = req.user;
        if (!userInfo.isAdmin) {
            return handleError(res, 403, "Authorization Error: Only admin can create borrowing");
        }

        let { userId, bookId } = req.body;
        let borrowing = await createBorrwing(userId, bookId);
        res.send(borrowing);
    } catch (error) {
        handleError(res, error.status || 400, error.message);
    }
});


router.patch("/", auth, async (req, res) => {
    try {
        const userInfo = req.user;
        if (!userInfo.isAdmin) {
            return handleError(res, 403, "Authorization Error: Only admin can return book");
        }

        let { userId, bookId } = req.body;
        let borrowing = await returnbook(userId, bookId);
        res.send(borrowing);
    } catch (error) {
        handleError(res, error.status || 400, error.message);
    }
});


router.get("/user/:id", auth, async (req, res) => {
    try {
        const userInfo = req.user;
        const { id } = req.params;
        if (!userInfo.isAdmin && userInfo._id != id) {
            return handleError(res, 403, "Authorization Error: Only admin or the user can see his borrowings");
        }

        let borrowings = await getUserBorrowings(id);
        res.send(borrowings);
    } catch (error) {
        handleError(res, error.status || 400, error.message);
    }
});


router.get("/", auth, async (req, res) => {
    try {
        const userInfo = req.user;
        if (!userInfo.isAdmin) {
            return handleError(res, 403, "Authorization Error: Only admin can see all borrowings");
        }

        let borrowings = await getBorrowings();
        res.send(borrowings);
    } catch (error) {
        handleError(res, error.status || 400, error.message);
    }
});


router.get("/late", auth, async (req, res) => {
    try {
        const userInfo = req.user;
        if (!userInfo.isAdmin) {
            return handleError(res, 403, "Authorization Error: Only admin can see all borrowings");
        }

        let borrowings = await getLateBorrowings();
        res.send(borrowings);
    } catch (error) {
        handleError(res, error.status || 400, error.message);
    }
});



router.get("/open", auth, async (req, res) => {
    try {
        const userInfo = req.user;
        if (!userInfo.isAdmin) {
            return handleError(res, 403, "Authorization Error: Only admin can see all borrowings");
        }

        let borrowings = await getOpenBorrowings();
        res.send(borrowings);
    } catch (error) {
        handleError(res, error.status || 400, error.message);
    }
});


router.get("/last/:id", auth, async (req, res) => {
    try {
        const userInfo = req.user;
        const { id } = req.params;
        if (!userInfo.isAdmin && userInfo._id != id) {
            return handleError(res, 403, "Authorization Error: Only admin or the user can see his borrowings");
        }

        let borrowings = await getLastUserBorrowings(id);
        res.send(borrowings);
    } catch (error) {
        handleError(res, error.status || 400, error.message);
    }
});

router.get("/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        let borrowing = await getBorrowing(id);
        res.send(borrowing);
    } catch (error) {
        handleError(res, error.status || 400, error.message);
    }
});

module.exports = router;