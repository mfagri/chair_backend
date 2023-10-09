// categoryRoutes.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// app.post("/addCategory", upload.single("icon"), async (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).send("No file uploaded.");
//     }

//     const { name } = req.body;
//     const iconFilename = req.file.filename; // Get the filename of the uploaded icon

//     // Use Prisma or your ORM to create a new category with a reference to the uploaded icon
//     const category = await prisma.category.create({
//       data: {
//         name,
//         icon: `/uploads/${iconFilename}`, // Store the file path in the database
//       },
//     });

//     return res.json(category);
//   } catch (error) {
//     console.error("Error adding category:", error);
//     return res.status(500).json({ error: "Failed to add category" });
//   }
// });

async function addCategory(req,res){
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }

    const { name } = req.body;
    const iconFilename = req.file.filename; // Get the filename of the uploaded icon

    // Use Prisma or your ORM to create a new category with a reference to the uploaded icon
    const category = await prisma.category.create({
      data: {
        name,
        icon: `/uploads/${iconFilename}`, // Store the file path in the database
      },
    });

    return category;
  } catch (error) {
    console.error("Error adding category:", error);
    return { error: "Failed to add category" };
  }
}

async function getCategorys(req,res){
  try{

    const categorys = await prisma.category.findMany(
      {
        include:{
          products:true,
          
        }
      }
    );
    res.json(categorys);
  }
  catch(e)
  {
    console.error('Error adding category:', error);
    res.status(500).json({ error: 'Failed to add category' });
  }
}
async function createProduct(categoryId) {
  try {
    const product = await prisma.product.create({
      data: {
        name: 'Product Name',
        categoryId: categoryId, // Replace with the actual category ID
        price: 29.99, // Replace with the actual price
        images: {
          create: [
            {
              image: 'image_url_1.jpg', // Replace with the actual image URL
              is3d: false, // Replace with the actual value
              model: 'model_name_1', // Replace with the actual model name
            },
            {
              image: 'image_url_2.jpg', // Replace with the actual image URL
              is3d: true, // Replace with the actual value
              model: 'model_name_2', // Replace with the actual model name
            },
            // Add more images as needed
          ],
        },
      },
      include: {
        images: true, // Include the images associated with the product in the result
      },
    });

    console.log('Product created with images:', product);
  } catch (error) {
    console.error('Error creating product with images:', error);
  } finally {
    await prisma.$disconnect(); // Disconnect from the database when done
  }
}
async function getProductById(productId) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      include: {
        category: true, // Include the category details if needed
        images: true,   // Include the images associated with the product
      },
    });

    if (!product) {
      console.log('Product not found');
      return;
    }

    console.log('Product details:', product);
    return product;
  } catch (error) {
    console.error('Error getting product:', error);
  } finally {
    await prisma.$disconnect(); // Disconnect from the database when done
  }
}
module.exports = {
  addCategory,
  getCategorys,
  createProduct,
  getProductById
};
