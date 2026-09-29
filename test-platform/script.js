const canvas = document.querySelector("#game");

const gamePath = "/Game/TheThreeFacesWEBGL/TheThreeFacesWEBGL/Build";

const config = {
    dataUrl: gamePath + "/TheThreeFacesWEBGL.data.gz",
    frameworkUrl: gamePath + "/TheThreeFacesWEBGL.framework.js.gz",
    codeUrl: gamePath + "/TheThreeFacesWEBGL.wasm.gz",

    streamingAssetsUrl: "/Game/TheThreeFacesWEBGL/StreamingAssets",

    companyName: "DefaultCompany",
    productName: "The Three Faces",
    productVersion: "1.0"
};

createUnityInstance(canvas, config)
    .then((unityInstance) => {
        console.log("Unity cargado correctamente");
    })
    .catch((error) => {
        console.error("Error cargando Unity:", error);
    });