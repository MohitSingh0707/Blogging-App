const express = require("express");
const path = require("path");
const cookieParser = require('cookie-parser');
const Blog = require('./models/blog')
const dotenv = require("dotenv");
dotenv.config();

const { checkForauthenticationCookie } = require("./middlewares/authentication"); // ⬅️ move this up

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(checkForauthenticationCookie("token"));
app.use(express.static(path.resolve('./public')))
app.use(express.json());

const connectDb = require("./config/connectDB");
connectDb();

app.set("view engine", "ejs");
app.set("views", "./views");

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs:allBlogs, 
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
