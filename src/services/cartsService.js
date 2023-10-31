import { cartModel } from "../models/cartModel.js";

export class cartService {
  async getAllCartService() {
    try {
      const carts = await cartModel.find().populate("products.product").lean();
      return carts;
    } catch (error) {
      console.error("Error en getAllCartService:", error);
      throw error;
    }
  }

  async addCartService(cart) {
    try {
      const addCart = await cartModel.create(cart);
      const carts = await cartModel.findById(addCart._id);
      return carts;
    } catch (error) {
      console.error("Error en addCartService:", error);
      throw error;
    }
  }

  async getCartByIdService(id) {
    try {
      const cartsById = await cartModel
        .findById(id)
        .populate("products.product")
        .lean();
      return cartsById;
    } catch (error) {
      console.error("Error en getCartByIdService:", error);
      throw error;
    }
  }

  async updateCartService(cartId, updatedCart) {
    try {
      const result = await cartModel.findByIdAndUpdate(
        cartId,
        { $set: { products: updatedCart.products } },
        { new: true }
      );

      if (!result) {
        throw new Error("Carrito no encontrado");
      }

      return result;
    } catch (error) {
      console.error("Error en updateCartService:", error);
      throw error;
    }
  }

  async updateProductQuantityService(cartId, productId, newQuantity) {
    try {
      const updatedCart = await cartModel
        .findOneAndUpdate(
          { _id: cartId, "products.product": productId },
          { $set: { "products.$.quantity": newQuantity } },
          { new: true }
        )
        .lean();

      return updatedCart;
    } catch (error) {
      console.error("Error en updateProductQuantityService:", error);
      throw error;
    }
  }

  async deleteProductFromCartService(cartId, productId) {
    try {
      const updatedCart = await cartModel
        .findByIdAndUpdate(
          cartId,
          { $pull: { products: { product: productId } } },
          { new: true }
        )
        .lean();

      if (!updatedCart) {
        throw new Error(
          "Carrito no encontrado o producto no existe en el carrito"
        );
      }

      return updatedCart;
    } catch (error) {
      console.error("Error en deleteProductFromCartService:", error);
      throw error;
    }
  }

  async clearCartService(cartId) {
    try {
      const updatedCart = await cartModel
        .findByIdAndUpdate(cartId, { products: [] }, { new: true })
        .lean();

      if (!updatedCart) {
        throw new Error("Carrito no encontrado");
      }

      return updatedCart;
    } catch (error) {
      console.error("Error en clearCartService:", error);
      throw error;
    }
  }

  async addProductToCartService(cartId, productId) {
    try {
      const cart = await cartModel.findById(cartId);

      if (!cart) {
        throw new Error("Carrito no encontrado");
      }

      const existingProduct = cart.products.find((product) =>
        product.product.equals(productId)
      );

      if (existingProduct) {
        existingProduct.quantity++;
      } else {
        cart.products.push({ product: productId, quantity: 1 });
      }

      await cart.save();

      return cart;
    } catch (error) {
      console.error("Error en addProductToCartService:", error);
      throw error;
    }
  }

  async createCartService() {
    try {
      const newCart = await cartModel.create({
        products: [],
      });
      return newCart._id;
    } catch (error) {
      console.error("Error al crear un carrito:", error);
      throw error;
    }
  }
}
