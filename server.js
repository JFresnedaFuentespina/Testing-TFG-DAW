const express = require("express");
const path = require("path");
const fs = require("fs");
const AdmZip = require("adm-zip");

const app = express();
const PORT = 3000;

// Rutas
const gameZip = path.join(__dirname, "Game", "TheThreeFacesWEBGL.zip");
const gameFolder = path.join(__dirname, "Game", "TheThreeFacesWEBGL");

// Página web
app.use(express.static(path.join(__dirname, "test-platform")));

// Extraer el juego si todavía no existe
if (!fs.existsSync(gameFolder)) {
    console.log("Descomprimiendo TheThreeFacesWEBGL.zip...");
    try {
        const zip = new AdmZip(gameZip);

        zip.extractAllTo(gameFolder, true);
        console.log("Juego descomprimido correctamente");

    } catch (error) {
        console.error("Error al descomprimir el juego:", error);
    }

}

// Archivos de Unity
app.use("/Game", express.static(path.join(__dirname, "Game"), {

    setHeaders: (res, filePath) => {

        // Servir la página de la plataforma
        app.use(express.static(testPlatformPath));


        if (filePath.endsWith(".wasm.gz")) {

            res.setHeader(
                "Content-Type",
                "application/wasm"
            );

        } else if (filePath.endsWith(".js.gz")) {

            res.setHeader(
                "Content-Type",
                "application/javascript"
            );

        } else {

            res.setHeader(
                "Content-Type",
                "application/octet-stream"
            );
        }

        console.log(`Juego descomprimido en ${extractPath}`);

    } catch(error) {

        console.error(
            `Error al descomprimir ${game}.zip:`,
            error
        );

        return res
            .status(500)
            .send("Error al descomprimir el juego");
    }
}

    // Buscar index.html
    const indexPath = path.join(
    extractPath,
    "index.html"
);

if (!fs.existsSync(indexPath)) {

    return res
        .status(404)
        .send("index.html no encontrado en el juego");
}

res.sendFile(indexPath);
});


// ===============================
// ARCHIVOS DE LOS JUEGOS
// ===============================

app.use("/play/:game", (req, res, next) => {

    const game = req.params.game;

    const gamePath = path.join(
        tempPath,
        game
    );

    express.static(gamePath, {

        setHeaders: (res, filePath) => {

            if (filePath.endsWith(".gz")) {

                res.setHeader(
                    "Content-Encoding",
                    "gzip"
                );

                if (filePath.endsWith(".wasm.gz")) {

                    res.setHeader(
                        "Content-Type",
                        "application/wasm"
                    );

                } else if (filePath.endsWith(".js.gz")) {

                    res.setHeader(
                        "Content-Type",
                        "application/javascript"
                    );

                } else {

                    res.setHeader(
                        "Content-Type",
                        "application/octet-stream"
                    );
                }
            }
        }

    })(req, res, next);
});


// ===============================
// SERVIDOR
// ===============================

// Borrar el juego descomprimido al cerrar el servidor
function limpiarJuego() {
    if (fs.existsSync(gameFolder)) {
        try {
            fs.rmSync(gameFolder, {
                recursive: true,
                force: true
            });
            console.log("Carpeta del juego eliminada.");
        }
        catch (error) {
            console.error("Error eliminando la carpeta del juego");
        }
    }
}

process.on("SIGINT", () => {
    console.log("\Cerrando servidor...");
    limpiarJuego();
    process.exit(0);
});

app.listen(PORT, () => {

    console.log(
        `Servidor funcionando en http://localhost:${PORT}`
    );

});