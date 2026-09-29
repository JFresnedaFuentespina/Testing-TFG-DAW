const canvas = document.querySelector("#game");

const gamePath = "/Game/TheThreeFacesWEBGL/TheThreeFacesWEBGL";

const config = {
    dataUrl: gamePath + "/Build/TheThreeFacesWEBGL.data.gz",
    frameworkUrl: gamePath + "/Build/TheThreeFacesWEBGL.framework.js.gz",
    codeUrl: gamePath + "/Build/TheThreeFacesWEBGL.wasm.gz",

    streamingAssetsUrl: gamePath + "/StreamingAssets",

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