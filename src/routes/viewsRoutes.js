import { Router } from "express";
import { productsManager } from "../dao/dataAccess/mongo/productsManager.js";
import { messageManager } from "../dao/dataAccess/mongo/messageManager.js";
import { cartManager } from "../dao/dataAccess/mongo/cartsManager.js";
import passport from "passport";

const cartsManager = new cartManager();
const messagesManager = new messageManager();
const productManager = new productsManager();

const router = Router();

router.get("/", async (req, res) => {
  const products = await productManager.getAllproduct();
  res.render("home", { products });
});

router.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getAllproduct();
  res.render("product/realTimeProducts", { products });
});

router.get("/chat", async (req, res) => {
  const messages = await messagesManager.getAllMessage();
  res.render("chat", { messages });
});

router.get("/products", async (req, res) => {
  try {
    const { first_name, last_name } = req.session;
    const user = req.user;
    if (!req.session.cartId) {
      const newCart = await cartsManager.createCart();
      req.session.cartId = newCart._id;
    }

    const page = req.query.page || 1;
    const limit = 6;

    const productsResult = await productManager.getPaginatedProducts(
      page,
      limit
    );
    const products = productsResult.docs;
    const totalPages = productsResult.totalPages;

    res.render("product/products", {
      user,
      products,
      totalPages,
      currentPage: page,
      first_name,
      last_name,
      rol: req.session.rol,
    });
  } catch (error) {
    console.error("Error al obtener productos paginados:", error);
    res.status(500).send("Error al obtener productos");
  }
});

router.post("/add-to-cart/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;
    const cartId = req.session.cartId;

    if (!cartId) {
      const newCart = await cartsManager.createCart();
      req.session.cartId = newCart._id;
    } else {
      const existingCart = await cartsManager.getCartById(cartId);

      if (!existingCart || !existingCart._id) {
        console.log(
          "No se encontró un carrito existente o su ID:",
          existingCart
        );

        const newCart = await cartsManager.createCart();
        req.session.cartId = newCart._id;
      } else {
        console.log("ID del carrito existente:", existingCart._id);
      }
    }
    await cartsManager.addProductToCart(req.session.cartId, productId);

    return res.redirect("/products");
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    return res.status(500).send("Error al agregar producto al carrito");
  }
});

router.get("/cart/:cartId", async (req, res) => {
  const cartId = req.params.cartId;

  const cart = await cartsManager.getCartById(cartId);

  res.render("cart/cart", { cart });
});

router.get("/profile", async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      const user = req.user;
      const cart = await cartsManager.getCartById(user.cart);
      const { first_name, last_name, email, age, rol } = req.session;

      if (user.cart) {
        return res.render("user/profile", {
          user,
          first_name,
          last_name,
          email,
          age,
          rol,
          cart,
        });
      }
      return res.render("user/profile", {
        user,
        first_name,
        last_name,
        email,
        age,
        rol,
      });
    }

    if (req.session && req.session.email) {
      const cart = await cartsManager.getCartById(req.session.cartId);
      return res.render("profile", {
        first_name: req.session.first_name,
        last_name: req.session.last_name,
        email: req.session.email,
        age: req.session.age,
        cart: cart,
        rol: req.session.rol,
      });
    }

    return res.redirect("/login");
  } catch (error) {
    console.error("Error al renderizar el perfil:", error);
    res.status(500).send("Error al renderizar el perfil");
  }
});

router.get("/signup", async (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/login");
  }

  res.render("auth/signup");
});

router.get("/login", async (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/products");
  }
  res.render("auth/login");
});

router.get("/recover", async (req, res) => {
  if (req.isAuthenticated()) {
    res.redirect("/products");
  }
  res.render("auth/recover");
});

router.post("/logout", async (req, res) => {
  try {
    req.logout((err) => {
      if (err) {
        console.error("Error al destruir la sesión:", err);
        return res.status(500).send("Error al cerrar sesión");
      }

      req.session.destroy((err) => {
        if (err) {
          console.error("Error al destruir la sesión:", err);
          return res.status(500).send("Error al cerrar sesión");
        }

        res.redirect("/login");
      });
    });
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    res.status(500).send("Error al cerrar sesión");
  }
});

router.get("/failregister", (req, res) => res.send("Fallo en registro"));

router.get("/faillogin", (req, res) => res.send("Fallo en login"));

router.get("/auth/github", passport.authenticate("github"));

router.get(
  "/api/githubcallback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  (req, res) => {
    req.session.user = req.user;
    req.session.first_name = req.user.first_name;
    req.session.last_name = req.user.last_name;
    req.session.email = req.user.email;
    req.session.age = req.user.age;

    if (req.user.cart) {
      req.session.cartId = req.user.cart;
    }
    req.session.isLogged = true;
    res.redirect("/profile");
  }
);
export default router;
