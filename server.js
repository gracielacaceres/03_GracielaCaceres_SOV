//Requiriendo el módulo 'express', 'cors' y 'body-parser'
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

//Requiriendo la conexión a BD gestor (MySQL)
const connection = require("./configBD");

//Creando una nueva aplicación Express.
const app = express();
const path = require("path");

/**
 * app.use(cors()): Es un middleware, al utilizar app.use(cors()),
 * estás permitiendo que tu servidor responda a las solicitudes de otros dominios.
 
 * app.use(bodyParser.urlencoded({ extended: false })): habilita el middleware de body-parser para analizar los datos enviados
 * en el cuerpo de las solicitudes HTTP.
 * body-parser es un middleware de Express que permite acceder y procesar los datos enviados en formularios HTML.
 * bodyParser.urlencoded() se utiliza para analizar los datos codificados en URL enviados en las solicitudes POST.
 * El parámetro { extended: false } configura el analizador para que solo admita datos codificados en URL tradicionales.
 */
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/**
 * app.use Se utiliza para montar middlewares en la aplicación Express.
 * Los middlewares son funciones que se ejecutan en el flujo de procesamiento de una solicitud antes
 * de que se envíe una respuesta Middleware para servir archivos estáticos desde la carpeta "public"
 */
app.use("/public", express.static(path.join(__dirname, "public")));

/**
 * Establecer EJS como el Motor de plantillas
 */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/**
 * Definiendo mi ruta Home
 */
app.get("/", (req, res) => {
  res.render("inicio", {
    rutaActual: "/",
  });
});

/**
 * Ruta para mostrar el formulario
 */
app.get("/form-estudiante", (req, res) => {
  res.render("pages/form", {
    rutaActual: "/form-estudiante",
  });
});

/**
 * PROCESANDO FORMULARIO
 * el módulo mysql2 y el uso de async/await para realizar la inserción en la base de datos,
 * permite que tu código sea más legible y fácil de mantener.
 * Además, mysql2 es una biblioteca más moderna y eficiente para interactuar con MySQL en comparación con el módulo mysql.
 */

app.post("/procesar-formulario", async (req, res) => {
  console.log(req.body);

  // Check for empty fields
  for (const campo in req.body) {
    if (!req.body[campo]) {
      res.send(`Error: El campo ${campo} está vacío.`);
      return;
    }
  }

  const {
    NOMBRE_Y_APELLIDO,
    CORREO,
    CURSO,
    FECHA_DE_REGISTRO,
    DNI,
    CELULAR,
    DIRECCION,
  } = req.body;

  try {
    const query =
      "INSERT INTO estudiantes (NOMBRE_Y_APELLIDO, CORREO, CURSO, FECHA_DE_REGISTRO, DNI, CELULAR, DIRECCION) VALUES (?, ?, ?, ?, ?, ?, ?)";
    await connection.execute(query, [
      NOMBRE_Y_APELLIDO,
      CORREO,
      CURSO,
      FECHA_DE_REGISTRO,
      DNI,
      CELULAR,
      DIRECCION,
    ]);

    res.render("inicio", {
      rutaActual: "/",
    });
  } catch (error) {
    console.error("Error al insertar en la base de datos: ", error);
    console.log(error);
    res.send("Error al procesar el formulario");
  }
});


// Iniciar el servidor con Express
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
