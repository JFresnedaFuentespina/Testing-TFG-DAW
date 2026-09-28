const express = require("express");
const path = require("path");
const fs = require("fs");
const AdmZip = require("adm-zip");

const app = express();
const PORT = 3000;

// Rutas
const testPlatformPath = path.join(__dirname, "test-platform");
const gamesPath = path.join(__dirname, "Game");
const tempPath = path.join(__dirname, "temp");

// Crear carpeta temporal si no existe
if (!fs.existsSync(tempPath)) {
    fs.mkdirSync(tempPath, { recursive: true });
    console.log("Carpeta temporal creada");
}

// Servir la página de la plataforma
app.use(express.static(testPlatformPath));


// ===============================
// JUGAR A UN JUEGO
// ===============================

app.get("/play/:game", (req, res) => {

    const game = req.params.game;

    const zipPath = path.join(gamesPath, `${game}.zip`);
    const extractPath = path.join(tempPath, game);

    // Comprobar ZIP
    if (!fs.existsSync(zipPath)) {
        return res.status(404).send("Juego no encontrado");
    }

    // Descomprimir si todavía no existe
    if (!fs.existsSync(extractPath)) {

        console.log(`Descomprimiendo ${game}.zip...`);

        try {

            const zip = new AdmZip(zipPath);
            const entries = zip.getEntries();

            for (const entry of entries) {

                const entryPath = entry.entryName;
                const parts = entryPath.split("/");

                // Quitar primera carpeta
                if (parts.length <= 1) {
                    continue;
                }

                const relativePath = parts.slice(1).join("/");
                const outputPath = path.join(extractPath, relativePath);

                if (entry.isDirectory) {

                    fs.mkdirSync(outputPath, {
                        recursive: true
                    });

                } else {

                    fs.mkdirSync(path.dirname(outputPath), {
                        recursive: true
                    });

                    fs.writeFileSync(
                        outputPath,
                        entry.getData()
                    );
                }
            }

            console.log(`Juego descomprimido en ${extractPath}`);

        } catch (error) {

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

app.listen(PORT, () => {

    console.log(
        `Servidor funcionando en http://localhost:${PORT}`
    );

});