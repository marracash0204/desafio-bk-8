import { cartService } from "../../../services/cartsService.js";

const cartServices = new cartService();

export class cartManager {
  async getAllCart() {
    try {
      const carts = await cartServices.getAllCartService();
      return carts;
    } catch (error) {
      console.error("Error en getAllCart:", error);
      throw error;
    }
  }

  async addCart(cart) {
    try {
      const addCart = await cartServices.addCartService(cart);
      return addCart;
    } catch (error) {
      console.error("Error en addCart:", error);
      throw error;
    }
  }

  async getCartById(id) {
    try {
      const cartsById = await cartServices.getCartByIdService(id);
      return cartsById;
    } catch (error) {
      console.error("Error en getCartById:", error);
      throw error;
    }
  }

  async updateCart(cartId, updatedCart) {
    try {
      const result = await cartServices.updateCartService(cartId, updatedCart);

      if (!result) {
        throw new Error("Carrito no encontrado");
      }

      return result;
    } catch (error) {
      console.error("Error en updateCart:", error);
      throw error;
    }
  }

  async updateProductQuantity(cartId, productId, newQuantity) {
    try {
      const updatedCart = await cartServices.updateProductQuantityService(
        cartId,
        productId,
        newQuantity
      );

      if (!updatedCart) {
        throw new Error("Carrito o producto no encontrado");
      }

      return updatedCart;
    } catch (error) {
      throw error;
    }
  }

  async deleteProductFromCart(cartId, productId) {
    try {
      const updatedCart = await cartServices.deleteProductFromCartService(
        cartId,
        productId
      );
      return updatedCart;
    } catch (error) {
      console.error("Error en deleteProductFromCart:", error);
      throw error;
    }
  }

  async clearCart(cartId) {
    try {
      const updatedCart = await cartServices.clearCartService(cartId);
      return updatedCart;
    } catch (error) {
      console.error("Error en clearCart:", error);
      throw error;
    }
  }

  async addProductToCart(cartId, productId) {
    try {
      const cart = await cartServices.addProductToCartService(
        cartId,
        productId
      );
      return cart;
    } catch (error) {
      console.error("Error en addProductToCart:", error);
      throw error;
    }
  }

  async createCart() {
    try {
      const cartId = await cartServices.createCartService();
      return cartId;
    } catch (error) {
      console.error("Error al crear un carrito:", error);
      throw error;
    }
  }
}
