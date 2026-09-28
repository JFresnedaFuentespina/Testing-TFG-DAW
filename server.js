const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// Página web
app.use(express.static(path.join(__dirname, "test-platform")));

// Archivos de Unity
app.use("/Game", express.static(path.join(__dirname, "Game"), {
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

app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});