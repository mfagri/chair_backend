
const categories = [
    {
      name: "Wooden Chairs",
      icon: "/icons/wooden-chair-chair-svgrepo-com", // Replace with the actual SVG icon for wooden chairs
    },
    {
      name: "Metal Chairs",
      icon: "/icons/wooden-chair-chair-svgrepo-com", // Replace with the actual SVG icon for metal chairs
    },
    {
      name: "Plastic Chairs",
      icon: "/icons/wooden-chair-chair-svgrepo-com", // Replace with the actual SVG icon for plastic chairs
    },
    {
      name: "Office Chairs",
      icon: "/icons/wooden-chair-chair-svgrepo-com", // Replace with the actual SVG icon for office chairs
    },
    {
      name: "Dining Chairs",
      icon: "/icons/wooden-chair-chair-svgrepo-com", // Replace with the actual SVG icon for dining chairs
    },
    {
      name: "Lounge Chairs",
      icon: "/icons/wooden-chair-chair-svgrepo-com", // Replace with the actual SVG icon for lounge chairs
    },
    {
      name: "Outdoor Chairs",
      icon: "/icons/wooden-chair-chair-svgrepo-com", // Replace with the actual SVG icon for outdoor chairs
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

  module.exports ={
    categories
  }