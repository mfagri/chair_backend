// categoryRoutes.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function addCategory(req, res) {
  try {
    // Assuming the request body contains the data to add
    const { name, icon } = req.body;

    // Use Prisma or your ORM to create a new category
    const category = await prisma.category.create({
      data: {
        name,
        icon,
      },
    });

    // Respond with the created category
    res.json(category);
  } catch (error) {
    console.error('Error adding category:', error);
    res.status(500).json({ error: 'Failed to add category' });
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


module.exports = {
  addCategory,
  getCategorys
};
