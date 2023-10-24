const express = require("express");
const Route = express.Router();
const {auth} = require(
  '../middleware/authMiddleware'
)
const {
  createuser,
  userfind,
  signuserjwt,
  authenticateToken,
} = require("../controllers/userController");

Route.post("/signin", async (req, res) => {
  find = await userfind(req.body.data.email);
  if (find) {
    let data = await signuserjwt(find);
    console.log(data);
    res.send(data);
  } else {
    let data = await signuserjwt(await createuser(req.body.data));
    console.log(data);

    res.send(data);
  }
});
Route.get("/myuser", auth,async (req, res) => {
  console.log("in myuser" + req.usr);
  res.send(req.user);
});


module.exports = Route;