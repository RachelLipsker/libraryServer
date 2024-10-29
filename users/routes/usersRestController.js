const express = require("express");
const { registerUser, loginUser, getUsers, getUser, updateUser, deleteUser, isAdminUser, changeBorrowingsNumber, changeOrdersNumber } = require("../models/usersAccessDataService");
const { handleError } = require("../../utils/handleErrors");
const auth = require("../../auth/authService");
const { validateRegistration, validateEdit } = require("../validation/userValidationService");



const router = express.Router();


router.post("/", async (req, res) => {
    try {
        const error = validateRegistration(req.body);
        if (error) return handleError(res, 400, `Joi Error: ${error}`);

        let user = await registerUser(req.body);
        res.send(user);
    } catch (error) {
        handleError(res, 400, error.message);
    }
});


router.post("/login", async (req, res) => {
    try {
        let { email, password } = req.body;
        const token = await loginUser(email, password);
        res.send(token);
    } catch (error) {
        handleError(res, 400, error.message);
    }
});


router.get("/", auth, async (req, res) => {
    try {
        const userInfo = req.user;
        if (!userInfo.isAdmin) {
            return handleError(res, 403, "Authorization Error: Only admin can see all users");
        }
        let users = await getUsers();
        res.send(users);
    } catch (error) {
        handleError(res, 400, error.message);
    }
});

router.get("/:id", auth, async (req, res) => {
    try {
        const userInfo = req.user;
        const { id } = req.params;
        if (userInfo._id != id && !userInfo.isAdmin) {
            return handleError(res, 403, "Authorization Error: Only admin or the user can see his profile");
        }
        let user = await getUser(id);
        res.send(user);
    } catch (error) {
        handleError(res, 400, error.message);
    }
});



router.put("/:id", auth, async (req, res) => {
    try {
        const userInfo = req.user;
        const newUser = req.body;
        const { id } = req.params;
        if (userInfo._id != id) {
            return handleError(
                res,
                403,
                "Authorization Error: Only the user can edit his details"
            );
        }

        const errorMessage = validateEdit(newUser);
        if (errorMessage !== "") {
            return handleError(res, 400, "Validation error: " + errorMessage);
        }

        let user = await updateUser(id, newUser);
        res.send(user);
    } catch (error) {
        handleError(res, error.status || 400, error.message);
    }
});

router.delete("/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const userInfo = req.user;

        if (!userInfo.isAdmin) {
            return handleError(res, 403, "Authorization Error: Only admin can delete user");
        }

        let user = await deleteUser(id);
        res.send(user);
    } catch (error) {
        handleError(res, 400, error.message);
    }
});

router.patch("isAdmin/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const userInfo = req.user;

        if (!userInfo.isAdmin) {
            return handleError(
                res, 403, "Authorization Error: Only the admin can change status"
            );
        }

        let user = await isAdminUser(id);
        res.send(user);
    } catch (error) {
        handleError(res, 400, error.message);
    }
});

router.patch("borrowings/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const userInfo = req.user;
        const { number } = req.body;

        if (!userInfo.isAdmin) {
            return handleError(
                res, 403, "Authorization Error: Only the admin can change number borrowings"
            );
        }

        let user = await changeBorrowingsNumber(id, number);
        res.send(user);
    } catch (error) {
        handleError(res, 400, error.message);
    }
});


router.patch("orders/:id", auth, async (req, res) => {
    try {
        const { id } = req.params;
        const userInfo = req.user;
        const { number } = req.body;

        if (!userInfo.isAdmin) {
            return handleError(
                res, 403, "Authorization Error: Only the admin can change number orders"
            );
        }

        let user = await changeOrdersNumber(id, number);
        res.send(user);
    } catch (error) {
        handleError(res, 400, error.message);
    }
});


module.exports = router;