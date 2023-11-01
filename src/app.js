import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import handlebars from "express-handlebars";
import handlebarsHelpers from "handlebars-helpers";
import initializePassport from "./services/passportService.js";
import productsRouter from "./routes/productsRoutes.js";
import cartRouter from "./routes/cartsRoutes.js";
import viewsrouter from "./routes/viewsRoutes.js";
import { Server } from "socket.io";
import passport from "passport";
import { messageManager } from "./dao/dataAccess/mongo/messageManager.js";
import mongoose from "mongoose";
import { productsManager } from "./dao/dataAccess/mongo/productsManager.js";
import userRouter from "./routes/userRoutes.js";
import config from "./config/config.js";

mongoose.connect(config.mongoURI);

const productManager = new productsManager();
const messagesManager = new messageManager();

const app = express();
const httpServer = app.listen(3001, () => console.log("puerto 3001"));
const socketServer = new Server(httpServer);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: config.mongoURI,
    }),
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
  })
);

initializePassport();
app.use(passport.initialize());
app.use(passport.session());

const hbs = handlebars.create({
  helpers: {
    ...handlebarsHelpers(),
  },
});

app.engine("handlebars", hbs.engine);
app.set("views", "./src/views");
app.set("view engine", "handlebars");
app.use(express.static("./src/public"));

app.use("/api", userRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartRouter);
app.use("/", viewsrouter);

socketServer.on("connection", async (socket) => {
  console.log("connection");

  const messages = await messagesManager.getAllMessage();
  const filteredMessages = messages.filter(
    (message) => message.message.trim() !== ""
  );
  socket.emit("historicalMessages", filteredMessages);

  socket.on("newMessage", async ({ user, message }) => {
    try {
      const newMessage = await messagesManager.newMessage(user, message);
      socketServer.emit("messageReceived", newMessage);
    } catch (error) {
      console.error("Error al crear un mensaje:", error);
    }
  });

  socket.on(
    "addProduct",
    async ({ title, price, description, code, stock }) => {
      await productManager.addProduct(title, description, price, code, stock);
      let products = await productManager.getAllproduct();
      socketServer.emit("productosActualizados", products);
    }
  );

  socket.on("productDeleted", async (id) => {
    await productManager.deleteProduct(id);
    let products = await productManager.getAllproduct();
    socketServer.emit("productosActualizados", products);
  });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado");
  });
});
