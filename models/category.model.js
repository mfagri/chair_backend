
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();



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
async function getCategorybyId(id){
  try{
    
    const category = await prisma.category.findMany(
      {
        where:{
          id:id
        },
        include:{
          products:true,
          
        }
      }
    );
    return category;
  }
  catch(e)
  {
    console.error('Error adding category:', error);
  }
}
async function createProduct(categoryId,colors,name,price,images,models,image) {
  try {
    const product = await prisma.product.create({
      data: {
        name: name,
        categoryId: categoryId, // Replace with the actual category ID
        price: parseFloat(price), // Replace with the actual price
        colors:colors,
        image:image,
        imagePath:images,
        modelPath:models
      }
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

async function getAllProduct(){
  try{
    const products = await prisma.product.findMany();
    return products;
  }
  catch(e)
  {}
}
module.exports = {
  addCategory,
  getCategorys,
  createProduct,
  getProductById,
  getAllProduct,
  getCategorybyId
};
