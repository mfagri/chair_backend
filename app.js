const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const expressSession = require("express-session");
const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");
require("dotenv").config();
const path = require("path");
const fs = require("fs").promises; 
const app = express();

const clientid = process.env.clientID;
const secret = process.env.clientSecret;

// Define your Swagger options
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "mfagri",
      version: "0.1",
    },
    servers: [
      {
        url: "http://localhost:3000/",
      },
    ],
  },
  apis: ["*.js"],
};
app.use(
  expressSession({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());
///
app.use(express.static(path.join(__dirname, "icons")));
////
passport.use(
  new GoogleStrategy(
    {
      clientID: clientid,
      clientSecret: secret,
      callbackURL: "http://localhost:3000/auth/google/callback", // Your callback URL
    },
    (accessToken, refreshToken, profile, done) => {
      // Use the profile information (e.g., profile.id, profile.displayName) to create or authenticate a user.
      // You can store user information in your database.
      console.log();
      return done(null, profile);
    }
  )
);
// Serialize user information for session storage
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

const swaggerSpec = swaggerJSDoc(swaggerOptions);

// ...

// Use Swagger documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ...

// Define your routes with Swagger documentation
/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Authenticate with Google
 *     description: Authenticate using Google OAuth.
 *     responses:
 *       200:
 *         description: Redirects to Google login page.
 */
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth Callback
 *     description: Callback URL for Google OAuth.
 *     responses:
 *       302:
 *         description: Redirects to the dashboard upon successful authentication.
 *       401:
 *         description: Authentication failure redirect.
 */
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Redirect to the desired route after successful authentication.
    res.redirect("/dashboard");
  }
);

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: User Dashboard
 *     description: Display the user's dashboard.
 *     responses:
 *       200:
 *         description: User dashboard page.
 */
app.get("/dashboard", (req, res) => {
  // Display the user's dashboard.
  res.send(`Welcome, ${req.user.displayName}!`);
});

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get Products
 *     description: Handle GET request for products.
 *     responses:
 *       200:
 *         description: Returns a JSON response with product information.
 */
app.get("/api/products", (req, res) => {
  // Handle GET request for products
  res.json({ message: "Get products" });
});
async function loadIcons() {
  const icons = {
    "wooden-chair-chair-svgrepo-com": await iconGenerate("wooden-chair-chair-svgrepo-com"),
    "armchair-2-svgrepo-com": await iconGenerate("armchair-2-svgrepo-com"),
    "deck-chair-svgrepo-com": await iconGenerate("deck-chair-svgrepo-com"),
    "desk-chair-chair-svgrepo-com": await iconGenerate("desk-chair-chair-svgrepo-com"),
    "chair-dining-svgrepo-com": await iconGenerate("chair-dining-svgrepo-com"),
    "wing-chair-svgrepo-com": await iconGenerate("wing-chair-svgrepo-com"),
    "student-chair-with-desk-svgrepo-com": await iconGenerate("student-chair-with-desk-svgrepo-com"),
    "sofa-free-4-svgrepo-com": await iconGenerate("sofa-free-4-svgrepo-com"),
    // "wooden-chair-chair-svgrepo-com": await iconGenerate("wooden-chair-chair-svgrepo-com"),
    // "wooden-chair-chair-svgrepo-com": await iconGenerate("wooden-chair-chair-svgrepo-com"),
    // Add more icons as needed
  };
  return icons;
}


/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get Categories
 *     description: Handle GET request for Categories.
 *     responses:
 *       200:
 *         description: Returns a JSON response with categories information.
 */
app.get("/api/categories", async (req, res) => {
  const icons = await loadIcons();
  categories = [
    {
      name: "Wooden",
      icon:  icons["wooden-chair-chair-svgrepo-com"], // Replace with the actual SVG icon wooden
    },
    {
      name: "Sofa",
      icon:  icons["sofa-free-4-svgrepo-com"], // Replace with the actual SVG icon wooden
    },
    {
      name: "Armchair",
      icon: icons["armchair-2-svgrepo-com"], // Replace with the actual SVG icon for metal
    },
    {
      name: "Deck",
      icon: icons["deck-chair-svgrepo-com"], // Replace with the actual SVG icon for plastic
    },
    {
      name: "Desk",
      icon: icons["desk-chair-chair-svgrepo-com"], // Replace with the actual SVG icon for office
    },
    {
      name: "Dining",
      icon: icons["chair-dining-svgrepo-com"], // Replace with the actual SVG icon for dining
    },
    {
      name: "Wing",
      icon: icons["wing-chair-svgrepo-com"], // Replace with the actual SVG icon for lounge
    },
    {
      name: "Student",
      icon: icons["student-chair-with-desk-svgrepo-com"], // Replace with the actual SVG icon for outdoor chairs
    },
    // Add more categories as needed
  ];

  res.json(categories);
});
// ...
// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

/**
 * @swagger
 * /api/icons:
 *   get:
 *     summary: Get icons
 *     description: Handle GET request for icons.
 *     responses:
 *       200:
 *         description: Returns a JSON response with icons information.
 */
app.get("/api/icons/:iconName", (req, res) => {
  const { iconName } = req.params;
  const iconFileName = `${iconName}.svg`;
  const iconFilePath = path.join(__dirname, "icons", iconFileName);

  // Read the SVG icon file as a string
  fs.readFile(iconFilePath, "utf8", (err, data) => {
    if (err) {
      // Handle any errors (e.g., file not found)
      res.status(404).send("Icon not found");
    } else {
      // Send the SVG icon content as a response
     
      res.send(data);
    }
  });
});

async function iconGenerate(iconName) {
  const iconFileName = `${iconName}.svg`;
  const iconFilePath = path.join(__dirname, "icons", iconFileName);
  
  try {
    const data = await fs.readFile(iconFilePath, "utf8");
    return data.toString();
  } catch (err) {
    console.error("Error reading SVG file:", err);
    return ""; // Return an empty string or some default value in case of an error
  }
}
