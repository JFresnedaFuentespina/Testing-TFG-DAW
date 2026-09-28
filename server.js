const express = require("express");
const path = require("path");
const fs = require("fs");
const AdmZip = require("adm-zip");

const app = express();
const PORT = 3000;

// Rutas

const testPlatfromPath = path.join(__dirname, "test-platform");
const gamesPath = path.join(__dirname, "Games");
const tempPath = path.join(__dirname, "temp");

// Crear carpeta temporal si no existe
if(!fs.existsSync(tempPath)) {
    fs.mkdirSync(tempPath, { recursive: true });
    console.log("Carpeta temporal creada");
}

// Servir la página de la plataforma
app.use(express.static(testPlatfromPath));

// Página web
app.get("/play/:game", (req, res) => {
    const game = req.params.game;

    const zipPath = path.join(gamesPath, `${game}.zip`);
    const extractPath = path.join(tempPath, game);

    // Comprobar si existe el zip
    if (!fs.existsSync(zipPath)) {
        return res.status(404).send("Juego no encontrado");
    }

    // Si todavía no está descomprimido
    if (!fs.existsSync(extractPath)) {
        console.log(`Descomprimiendo ${game}.zip...`);
        try{
            const zip = new AdmZip(zipPath);
            zip.extractAllTo(extractPath, true);
            console.log(`Juego ${game} descomprimido en ${extractPath}`);
        }
        catch (error) {
            console.error(`Error al descomprimir ${game}.zip:`, error);
            return res.status(500).send("Error al descomprimir el juego");
        }
    }

    // Buscar index.html
    const indexPath = path.join(extractPath, "index.html");
    if(!fs.existsSync(indexPath)) {
        return res.status(404).send("index.html no encontrado en el juego");
    }

    res.sendFile(indexPath);
});


// Archivos del juego
app.use("/Game/temp", express.static(tempPath, {

    setHeaders: (res, filePath) => {

        if (filePath.endsWith(".gz")) {

            res.setHeader("Content-Encoding", "gzip");

            if (filePath.endsWith(".wasm.gz")) {
                res.setHeader("Content-Type", "application/wasm");
            }
            else if (filePath.endsWith(".js.gz")) {
                res.setHeader("Content-Type", "application/javascript");
            }
            else {
                res.setHeader("Content-Type", "application/octet-stream");
            }
        }
    }
}));

// Servidor

app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});