import { messageModel } from "../models/chatModel.js";

export class messageService {
  async getAllMessageService() {
    try {
      const allMessage = await messageModel.find().lean();
      return allMessage;
    } catch (error) {
      console.error("Error en getAllMessageService:", error);
      throw error;
    }
  }

  async newMessageService(user, message) {
    try {
      const newMessage = await messageModel.create({
        user,
        message,
      });
      return newMessage;
    } catch (error) {
      console.error("Error en newMessageService:", error);
      throw error;
    }
  }
}
