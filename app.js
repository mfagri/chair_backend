const express = require("express");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const expressSession = require("express-session");
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
require('dotenv').config();
const path = require("path");
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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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


const categories = [
  {
    name: "Wooden Chairs",
    icon: "wooden-chair-chair-svgrepo-com.svg", // Replace with the actual SVG icon for wooden chairs
  },
  {
    name: "Metal Chairs",
    icon: "wooden-chair-chair-svgrepo-com.svg", // Replace with the actual SVG icon for metal chairs
  },
  {
    name: "Plastic Chairs",
    icon: "wooden-chair-chair-svgrepo-com.svg", // Replace with the actual SVG icon for plastic chairs
  },
  {
    name: "Office Chairs",
    icon: "wooden-chair-chair-svgrepo-com.svg", // Replace with the actual SVG icon for office chairs
  },
  {
    name: "Dining Chairs",
    icon: "wooden-chair-chair-svgrepo-com.svg", // Replace with the actual SVG icon for dining chairs
  },
  {
    name: "Lounge Chairs",
    icon: "wooden-chair-chair-svgrepo-com.svg", // Replace with the actual SVG icon for lounge chairs
  },
  {
    name: "Outdoor Chairs",
    icon: "wooden-chair-chair-svgrepo-com.svg", // Replace with the actual SVG icon for outdoor chairs
  },
  // Add more categories as needed
];

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
app.get("/api/categories", (req, res) => {
  // Create an array to store category data (excluding SVG icons)
  const categoryData = categories.map((category) => ({
    name: category.name,
  }));

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

  // Send the SVG icon file as a response
  res.sendFile(path.join(__dirname, "icons", iconFileName));
});
