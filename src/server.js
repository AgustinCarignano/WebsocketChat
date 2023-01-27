import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const PORT = 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", `${__dirname}/views`);

const httpServer = app.listen(PORT, () => {
  console.log(`Escuchando al puerto ${PORT}`);
});

app.get("/", (req, res) => {
  res.render("chat");
});

const mensajes = [];
const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
  console.log(`Cliente conectado, id: ${socket.id}`);
  socket.emit("bienvenida", "Conectado al servidor");

  socket.on("disconnect", () => {
    console.log(`Cliente desconectado, id: ${socket.id}`);
  });

  socket.on("nuevo ingreso", (user) => {
    socket.broadcast.emit("nuevo ingreso", user);
  });

  socket.on("mensaje", (msj) => {
    mensajes.push(msj);
    socketServer.emit("mensaje", mensajes);
  });
});
