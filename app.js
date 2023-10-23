const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const app = express();
app.use(cors());
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
const CategoryRoute = require("./routes/category");
const UserRoute = require("./routes/user");
const FavoriteRoute = require("./routes/favorite");
app.use("/api/", CategoryRoute);
app.use("/api/",UserRoute);
app.use("/api/",FavoriteRoute);


app.use("/uploads", express.static("uploads"));

// app.use(express.static(path.join(__dirname, "icons")));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
