const express = require("express");
const passport = require("passport");
const multer = require("multer");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const expressSession = require("express-session");
const swaggerUi = require("swagger-ui-express");
const bodyParser = require("body-parser");
const swaggerJSDoc = require("swagger-jsdoc");
const cors = require("cors");
require("dotenv").config();
const path = require("path");
const fs = require("fs").promises;
const app = express();
app.use(cors());
app.use(bodyParser.json());
const clientid = process.env.clientID;
const secret = process.env.clientSecret;
const { getAllProduct } = require("./models/category.model.js");
const { getProductById, addCategory } = require("./models/category.model.js");
const {
  createuser,
  userfind,
  signuserjwt,
  authenticateToken,
} = require("./models/user.model.js");
const {
  addtoFavorite,
  removefromFavorite,
  getAllFavorites,
  isProductInFavorites,
} = require("./models/favorite.model.js");
const { getCategorybyId } = require("./models/category.model.js");
const { createProduct } = require("./models/category.model.js");
const { getCategorys } = require("./models/category.model.js");
const { PrismaClient } = require("@prisma/client");
const { Rembg } = require("rembg-node");
const sharp = require("sharp");
const uuid = require("uuid");
var Jimp = require("jimp");

// uploads/1696975914057.jpeg
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

    // optionally you can use .trim() too!
    await output.trim().webp().toFile(`uploads/${randomName}`);
    console.log(output.options.fileOut);
    return output.options.fileOut;
  } catch (error) {
    console.error("Error in image processing:", error);
  }
}
const corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(
  expressSession({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/");
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const extension = path.extname(file.originalname);
    cb(null, `${timestamp}${extension}`);
  },
});

app.use(express.static(path.join(__dirname, "icons")));

app.use("/uploads", express.static("uploads"));

const upload = multer({ storage });

// Serve static files in the "uploads" directory (optional)
app.post("/signin", async (req, res) => {
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
app.get("/myuser", async (req, res) => {
  res.send(await authenticateToken(req));
});
app.use("/uploads", express.static("uploads"));
app.post("/addCategory", upload.single("icon"), async (req, res) => {
  res.json(addCategory(req, res));
});
app.get("/getCategorys", getCategorys);
app.get("/getAllProduct", async (req, res) => {
  res.send(await getAllProduct());
});
app.get("/getCategorybyId/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  res.send(await getCategorybyId(id));
});
app.post(
  "/createProduct/:categoryId",
  upload.fields([
    { name: "image", maxCount: 4 },
    { name: "model", maxCount: 4 },
    { name: "imageproduct", maxCount: 1 },
  ]),
  async (req, res) => {
    console.log("Req BODDY", req.files);
    console.log(" the BODDY", req.body);

    const { name, price, colors } = req.body;
    const data = req.files.image;
    let images = [];
    let models = [];
    let image = await removebackground(req.files.imageproduct[0].path);
    var i = 0;
    data.map(async (obj) => {
      console.log(i);
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
app.get("/getProductById/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  console.log(id);
  res.send(await getProductById(id));
});

app.post("/addtofavorite", async (req, res) => {
  res.send(await addtoFavorite(req.body.data));
});

app.post("/removefromfavorite", async (req, res) => {
  res.send(await removefromFavorite(req.body.data));
});


app.get("/getAllFavorites/:id", async (req, res) => {
  res.send(await getAllFavorites(parseInt(req.params.id)));
});
app.get("/isProductInFavorites/:userid/:productid",async (req,res)=>{
  res.send(await isProductInFavorites(parseInt(req.params.userid),parseInt(req.params.productid)));
});



const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
