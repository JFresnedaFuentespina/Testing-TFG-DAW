const express = require("express");
const path = require("path");
const fs = require("fs");
const AdmZip = require("adm-zip");

const app = express();
const PORT = 3000;

// ===============================
// RUTAS
// ===============================

const gameZip = path.join(
    __dirname,
    "Game",
    "TheThreeFacesWEBGL.zip"
);

const gameFolder = path.join(
    __dirname,
    "Game",
    "TheThreeFacesWEBGL"
);


// ===============================
// PÁGINA DE LA PLATAFORMA
// ===============================

app.use(
    express.static(
        path.join(__dirname, "test-platform")
    )
);


// ===============================
// DESCOMPRIMIR EL JUEGO
// ===============================

if (!fs.existsSync(gameFolder)) {

    console.log(
        "Descomprimiendo TheThreeFacesWEBGL.zip..."
    );

    try {

        const zip = new AdmZip(gameZip);

        zip.extractAllTo(gameFolder, true); // Sobrescribir archivos existentes

        console.log(
            "Juego descomprimido correctamente"
        );

    } catch (error) {

        console.error(
            "Error al descomprimir el juego:",
            error
        );
    }
}


// ===============================
// ARCHIVOS DE UNITY
// ===============================

app.use( // En la ruta /Game
    "/Game",
    express.static(
        path.join(__dirname, "Game"),
        {
            setHeaders: (res, filePath) => {

                if (filePath.endsWith(".gz")) {

                    // Decimos al navegador que el archivo
                    // está comprimido con Gzip
                    res.setHeader(
                        "Content-Encoding",
                        "gzip"
                    );

                    if (// Si el archivo es .wasm.gz, le decimos al navegador que es un archivo WebAssembly
                        filePath.endsWith(".wasm.gz")
                    ) {

                        res.setHeader(
                            "Content-Type",
                            "application/wasm"
                        );

                    } else if ( // Si el archivo es .js.gz, le decimos al navegador que es un archivo JavaScript
                        filePath.endsWith(".js.gz")
                    ) {

                        res.setHeader(
                            "Content-Type",
                            "application/javascript"
                        );

                    } else { // Si el archivo es .data.gz, le decimos al navegador que es un archivo binario

                        res.setHeader(
                            "Content-Type",
                            "application/octet-stream"
                        );
                    }
                }
            }
        }
    )
);


// ===============================
// LIMPIAR JUEGO AL CERRAR
// ===============================

function limpiarJuego() {

    if (!fs.existsSync(gameFolder)) {
        return;
    }

    try {

        fs.rmSync( // Eliminamos la carpeta del juego
            gameFolder,
            {
                recursive: true,
                force: true
            }
        );

        console.log(
            "Carpeta del juego eliminada."
        );

    } catch (error) {

        console.error(
            "Error eliminando la carpeta del juego:",
            error
        );
    }
}


// ===============================
// CERRAR SERVIDOR
// ===============================

process.on("SIGINT", () => {

    console.log(
        "\nCerrando servidor..."
    );

    limpiarJuego();

    process.exit(0);
});


// ===============================
// SERVIDOR
// ===============================

app.listen(PORT, () => {

    console.log(
        `Servidor funcionando en http://localhost:${PORT}`
    );

});