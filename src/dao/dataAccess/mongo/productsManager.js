import { productsService } from "../../../services/productsService.js";

const productsServices = new productsService();

export class productsManager {
  async getAllproduct() {
    try {
      const products = await productsServices.getAllProductService();
      return products;
    } catch (error) {
      console.error("Error en getAllproduct:", error);
      throw error;
    }
  }

  async getPaginatedProducts(page, limit) {
    try {
      const result = await productsServices.getPaginatedProductsService(page, limit);
      return result;
    } catch (error) {
      console.error("Error al obtener productos paginados:", error);
      throw error;
    }
  }

  async addProduct(title, description, price, code, stock) {
    try {
      const addproduct = await productsServices.addProductService(title, description, price, code, stock);
      return addproduct;
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      throw error;
    }
  }

  async getProductById(id) {
    try {
      const productsById = await productsServices.getProductByIdService(id);
      return productsById;
    } catch (error) {
      console.error("Error al obtener el producto por ID:", error);
      throw error;
    }
  }

  async updateProduct(id, nTitle, nDescription, nPrice, nCode, nStock) {
    try {
      const result = await productsServices.updateProductService(id, nTitle, nDescription, nPrice, nCode, nStock);
      return result;
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      throw error;
    }
  }

  async deleteProduct(id) {
    try {
      const result = await productsServices.deleteProductService(id);
      return result;
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      throw error;
    }
  }
}
