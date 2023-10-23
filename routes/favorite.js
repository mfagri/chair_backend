const express = require("express");
const Route = express.Router();
const { auth } = require("../middleware/authMiddleware");
const {
  addtoFavorite,
  removefromFavorite,
  getAllFavorites,
  isProductInFavorites,
} = require("../controllers/favoriteController");

Route.post("/addtofavorite", auth, async (req, res) => {
  res.send(await addtoFavorite(req.body.data));
});

Route.post("/removefromfavorite", auth, async (req, res) => {
  res.send(await removefromFavorite(req.body.data));
});

Route.get("/getAllFavorites/:id", auth, async (req, res) => {
  res.send(await getAllFavorites(parseInt(req.params.id)));
});
Route.get(
  "/isProductInFavorites/:userid/:productid",
  auth,
  async (req, res) => {
    res.send(
      await isProductInFavorites(
        parseInt(req.user.id),
        parseInt(req.params.productid)
      )
    );
  }
);

module.exports = Route;
