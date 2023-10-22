const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function addtoFavorite(data) {
  const userId =parseInt(data.userId) ;
  const productId = parseInt(data.productId) ;
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (user && product) {
      await prisma.favoriteProduct.create({
        data: {
          user: { connect: { id: userId } },
          product: { connect: { id: productId } },
        },
      });
      return { message: "Product added to favorites." };
    } else {
      return { message: "Product or user not found." };
    }
  } catch (error) {
    console.log(error);
    return { message: "Server error." };
  }
}

async function removefromFavorite(data) {
  try {
    const userId = parseInt(data.userId) ;
    const productId = parseInt(data.productId);
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (user && product) {
      const favoriteProductEntry = await prisma.favoriteProduct.findFirst({
        where: {
          userId: userId,
          productId: productId,
        },
      });

      if (favoriteProductEntry) {
        await prisma.favoriteProduct.delete({
          where: {
            id: favoriteProductEntry.id,
          },
        });

        return { message: "Product removed from favorites." };
      } else {
        return { message: "Favorite product not found." };
      }
    } else {
      return { message: "Product or user not found." };
    }
  } catch (error) {
    return { message: "Server error." };
  }
}

async function getAllFavorites(userId) {
  try {
    const favorites = await prisma.favoriteProduct.findMany({
      where: {
        userId: userId,
      },
      include: {
        product: true,
      },
    });

    return favorites;
  } catch (error) {
    console.error(error);
    throw new Error("Error fetching favorite products.");
  }
}

async function isProductInFavorites(userId, productId) {
	try {
	  
	  const favoriteProduct = await prisma.favoriteProduct.findFirst({
		where: {
		  userId: userId,
		  productId: productId,
		},
	  });
	  return !!favoriteProduct; 
	} catch (error) {
	  console.error(error);
	  throw new Error("Error checking if the product is in favorites.");
	}
  }
  
module.exports = {
  addtoFavorite,
  removefromFavorite,
  getAllFavorites,
  isProductInFavorites,
};
