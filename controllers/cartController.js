const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


async function addToCart(userId, productId, quantity) {
  try {
    // Check if the product is already in the cart
    const existingCartItem = await prisma.shoppingCart.findFirst({
      where: {
        userId: userId,
        productId: productId,
      },
    });

    if (existingCartItem) {
      // Update the quantity if the product is already in the cart
      await prisma.shoppingCart.update({
        where: { id: existingCartItem.id },
        data: { quantity: existingCartItem.quantity + quantity },
      });
    } else {
      // Add a new entry to the shopping cart
      await prisma.shoppingCart.create({
        data: {
          userId: userId,
          productId: productId,
          quantity: quantity,
        },
      });
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error adding to the shopping cart.");
  }
}

async function updateCartItemQuantity(userId, productId, quantity) {
  try {
    // Find the shopping cart entry for the user and product
    const cartItem = await prisma.shoppingCart.findFirst({
      where: {
        userId: userId,
        productId: productId,
      },
    });

    if (cartItem) {
      // Update the quantity
      await prisma.shoppingCart.update({
        where: { id: cartItem.id },
        data: { quantity: quantity },
      });
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error updating cart item quantity.");
  }
}

async function removeFromCart(userId, productId) {
  try {
    // Find the shopping cart entry for the user and product
    const cartItem = await prisma.shoppingCart.findFirst({
      where: {
        userId: userId,
        productId: productId,
      },
    });

    if (cartItem) {
      // Check if the quantity is zero, and if so, remove the item
      if (cartItem.quantity === 1) {
        await prisma.shoppingCart.delete({
          where: { id: cartItem.id },
        });
      } else {
        // Otherwise, decrement the quantity
        await prisma.shoppingCart.update({
          where: { id: cartItem.id },
          data: { quantity: cartItem.quantity - 1 },
        });
      }
    }
  } catch (error) {
    console.error(error);
    throw new Error("Error removing from the shopping cart.");
  }
}

async function getUserCart(userId) {
  try {
    const userCart = await prisma.shoppingCart.findMany({
      where: {
        userId: userId,
      },
      include: {
        product: true, // Include product details
      },
    });
    return userCart;
  } catch (error) {
    console.error(error);
    throw new Error("Error getting the user's shopping cart.");
  }
}

async function getAllCarts() {
  try {
    const allCarts = await prisma.shoppingCart.findMany({
      include: {
        product: true,
        user: true,
      },
    });
    return allCarts;
  } catch (error) {
    console.error(error);
    throw new Error("Error getting all shopping carts.");
  }
}


module.exports = {
	addToCart,
	updateCartItemQuantity,
	removeFromCart,
	getUserCart,
	getAllCarts,
  };