const express = require("express");
const multer = require("multer");
const Route = express.Router();
const {
  addCategory,
  getCategorys,
  createProduct,
  getProductById,
  getAllProduct,
  getCategorybyId,
} = require("../controllers/categoryController");

const { Rembg } = require("rembg-node");
const sharp = require("sharp");
const uuid = require("uuid");
var Jimp = require("jimp");
const path = require("path");
const fs = require("fs").promises;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `./uploads`);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    cb(null, `${timestamp}${extension}`);
  },
});

const upload = multer({ storage });

async function resizeimage(name) {
  console.log(name);
  Jimp.read(name, (err, lenna) => {
    if (err) throw err;
    lenna
      .resize(250, 250) // resize
      .quality(60) // set JPEG quality
      .greyscale() // set greyscale
      .write(`${name}`); // save
  });
  return `${name}`;
}

async function removebackground(name) {
  try {
    const input = sharp(name);
    const randomName = `${uuid.v4()}.webp`;
    // optional arguments
    const rembg = new Rembg({
      logging: true,
      // modelPath: u2NetModelPath,
    });

    const output = await rembg.remove(input);
    await output.webp().toFile("test-output.webp");
    await output.trim().webp().toFile(`uploads/${randomName}`);
    return output.options.fileOut;
  } catch (error) {
    console.error("Error in image processing:", error);
  }
}

Route.post("/addCategory", upload.single("icon"), async (req, res) => {
  res.json(addCategory(req, res));
});

Route.get("/getCategorys", getCategorys);

Route.get("/getAllProduct", async (req, res) => {
  res.send(await getAllProduct());
});

Route.get("/getCategorybyId/:id", async (req, res) => {
  res.send(await getCategorybyId(req));
});

Route.post(
  "/createProduct/:categoryId",
  upload.fields([
    { name: "image", maxCount: 4 },
    { name: "model", maxCount: 4 },
    { name: "imageproduct", maxCount: 1 },
  ]),
  async (req, res) => {
    const { name, price, colors } = req.body;
    const data = req.files.image;
    let images = [];
    let models = [];
    let image = await removebackground(req.files.imageproduct[0].path);
    var i = 0;
    data.map(async (obj) => {
      images[i] = "";
      models[i] = "";
      const nametype = obj.mimetype.toString();
      if (!nametype.includes("image")) models[i++] = obj.path;
      else images[i++] = await resizeimage(obj.path);
    });
    i = 0;
    const categoryid = parseInt(req.params.categoryId);
    res.send(
      createProduct(categoryid, colors, name, price, images, models, image)
    );
  }
);

Route.get("/getProductById/:id", async (req, res) => {
  res.send(await getProductById(req));
});

module.exports = Route;
