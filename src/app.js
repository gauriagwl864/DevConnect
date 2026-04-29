const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/posts", require("./routes/postsRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

app.use("/", require("./routes/viewRoutes"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  const status = err.status || 500;
  const message = err.message || "Something went wrong";

  if (req.originalUrl.startsWith("/api")) {
    return res.status(status).json({ error: message });
  }
  res.status(status).render("pages/error", { message });
});

module.exports = app;
