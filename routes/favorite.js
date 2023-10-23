const express = require("express");
const Route = express.Router();

const {
  addtoFavorite,
  removefromFavorite,
  getAllFavorites,
  isProductInFavorites,
} = require("../controllers/favoriteController");

Route.post("/addtofavorite", async (req, res) => {
  res.send(await addtoFavorite(req.body.data));
});

Route.post("/removefromfavorite", async (req, res) => {
  res.send(await removefromFavorite(req.body.data));
});

Route.get("/getAllFavorites/:id", async (req, res) => {
  res.send(await getAllFavorites(parseInt(req.params.id)));
});
Route.get("/isProductInFavorites/:userid/:productid", async (req, res) => {
  res.send(
    await isProductInFavorites(
      parseInt(req.params.userid),
      parseInt(req.params.productid)
    )
  );
});

module.exports = Route;
