const Author = require("../authors/models/mongodb/Author")
const Book = require("../books/models/mongodb/Book")
const Genre = require("../genres/models/mongodb/Genre")
const { generateUserPassword } = require("../users/helpers/bcrypt")
const User = require("../users/models/mongodb/User")


const initialUsers = [
    {
        firstName: "מנהל",
        lastName: "מנהל",
        phone: "0875542525",
        email: "adminadmin@gmail.com",
        password: generateUserPassword("Abc123456!"),
        isAdmin: true
    }
]

// const initialAutors = [
//     { name: "דבורה רוזן" },
//     { name: "יונה ספיר" },
// ]

// const initialGenres = [
//     { name: "מתח" },
//     { name: "רגש" },
// ]

// const initialBooks = [

// ]



const insertInitialData = async () => {
    const countUsers = await User.countDocuments();
    if (countUsers < 10) {
        await User.insertMany(initialUsers);
        console.log("initial users inserted");
    }

    // const countAuthors = await Author.countDocuments();
    // if (countAuthors < 10) {
    //     await Book.insertMany(initialAutors);
    //     console.log("initial authors inserted");
    // }


    // const countGenres = await Genre.countDocuments();
    // if (countGenres < 10) {
    //     await Book.insertMany(initialGenres);
    //     console.log("initial genres inserted");

    // }

    // const countBooks = await Book.countDocuments();
    // if (countBooks < 10) {
    //     await Book.insertMany(initialBooks);
    //     console.log("initial books inserted");

    // }

}

module.exports = insertInitialData;
