import { messageService } from "../../../services/messageService.js";

const messageServices = new messageService();

export class messageManager {
  async getAllMessage() {
    try {
      const allMessage = await messageServices.getAllMessageService();
      return allMessage;
    } catch (error) {
      console.error("Error en getAllMessage:", error);
      throw error;
    }
  }

  async newMessage(user, message) {
    try {
      const newMessage = await messageServices.newMessageService(user, message);
      return newMessage;
    } catch (error) {
      console.error("Error en newMessage:", error);
      throw error;
    }
  }
}
