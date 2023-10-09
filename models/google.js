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
  // app.post('/addCategory', addCategory);
