import { productsModel } from "../models/productsModel.js";

export class productsService {
  async getAllProductService() {
    try {
      const products = await productsModel.find().lean();
      return products;
    } catch (error) {
      console.error("Error en getAllProductService:", error);
      throw error;
    }
  }

  async getPaginatedProductsService(page, limit) {
    try {
      const options = {
        page,
        limit,
        lean: true,
      };

      const result = await productsModel.paginate({}, options);
      return result;
    } catch (error) {
      console.error(
        "Error al obtener productos paginados en productService:",
        error
      );
      throw error;
    }
  }

  async addProductService(title, description, price, code, stock) {
    try {
      const addproduct = await productsModel.create({
        title,
        description,
        price,
        code,
        stock,
      });
      return addproduct._id;
    } catch (error) {
      console.error("Error en addProductService:", error);
      throw error;
    }
  }

  async getProductByIdService(id) {
    try {
      const productsById = await productsModel.findById(id).lean();
      return productsById;
    } catch (error) {
      console.error("Error en getProductByIdService:", error);
      throw error;
    }
  }

  async updateProductService(id, nTitle, nDescription, nPrice, nCode, nStock) {
    try {
      const product = await productsModel.findById(id);

      if (!product) {
        return false;
      }

      product.price = nPrice;
      product.description = nDescription;
      product.title = nTitle;
      product.code = nCode;
      product.stock = nStock;

      await product.save();

      return true;
    } catch (error) {
      console.error("Error en updateProductService:", error);
      throw error;
    }
  }

  async deleteProductService(id) {
    try {
      const deletedProduct = await productsModel.findByIdAndRemove(id);

      if (!deletedProduct) {
        return { success: false, message: "Id inexistente" };
      }

      return { success: true, message: "Producto eliminado correctamente" };
    } catch (error) {
      console.error("Error en deleteProductService:", error);
      return { success: false, message: "No se pudo eliminar el producto" };
    }
  }
}
