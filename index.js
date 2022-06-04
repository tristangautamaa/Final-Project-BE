const express = require("express");
const routes = require("./routes");
const { Sequelize } = require("sequelize");
const session = require("express-session");
const app = express();
  
const PORT = 8000;

// Connect to MySQL
const sequelize = new Sequelize("final-project", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

// Authenticate / Connect to DB
sequelize
  .authenticate()
  .then(() => console.log("Database connected!")).catch((err) => console.log(`DB Connection Error - ${err}`));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.set("view-engine", "ejs");
app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "SECRET",
  })
);

app.use("/", routes);

app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
