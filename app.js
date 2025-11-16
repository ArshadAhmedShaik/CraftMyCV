const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const db = require("./db/connection");
const resumeRoutes = require("./routes/resumeRoutes");

const app = express();
const PORT = 8080;

app.use(express.static(path.join(__dirname, "public")));
app.use("/generated", express.static(path.join(__dirname, "generated")));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use("/", resumeRoutes);

// home page 
app.get("/", (req, res) => {
    res.send("<h1>Welcome to CraftMyCV Project! 💼</h1>");
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
