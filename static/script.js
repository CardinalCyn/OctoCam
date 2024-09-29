"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//pulls cameras, and sets them into the dropdown.
const setDropDown = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const rawResponse = yield fetch("/get_cameras");
        if (rawResponse.status !== 200) {
            alert("Server error");
            return;
        }
        const response = yield rawResponse.json();
        const select = document.querySelector('select[name="userCameras"]');
        if (response.status !== "successful") {
            alert("Error in pulling cameras: " + response.error);
            return;
        }
        const cameraKeys = Object.keys(response.cameras);
        if (!cameraKeys.length)
            alert("No cameras were found");
        for (const key of cameraKeys) {
            const option = document.createElement("option");
            option.text = key;
            option.value = response.cameras[key].toString();
            if (select)
                select.appendChild(option);
        }
    }
    catch (err) {
        console.log(err);
        alert(err);
    }
});
const pullStreams = (selectedCameraValue, width, height) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        //checks if server is online, and then will return snapshot and stream urls.
        const response = yield fetch("/serverOnline");
        const responseJson = yield response.json();
        if (responseJson.status !== "successful")
            return { status: "error", error: "Server is not online" };
        const hostResponse = yield fetch("/get_ip");
        const hostJson = yield hostResponse.json();
        const streamUrl = `http://${hostJson.ip}:${hostJson.port}/stream/${selectedCameraValue}/${width}/${height}`;
        const snapshotUrl = `http://${hostJson.ip}:${hostJson.port}/snapshot/${selectedCameraValue}/${width}/${height}`;
        return {
            status: "successful",
            streamUrl: streamUrl,
            snapshotUrl: snapshotUrl,
        };
    }
    catch (err) {
        return { status: "error", error: JSON.stringify(err) };
    }
});
const pullLinks = (event) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    if (event)
        event.preventDefault();
    const selectedCameraElement = document.querySelector('select[name="userCameras"]');
    const selectedCameraValue = selectedCameraElement === null || selectedCameraElement === void 0 ? void 0 : selectedCameraElement.value;
    if (!selectedCameraElement) {
        alert("An invalid camera was selected");
        return;
    }
    const width = (_a = document.getElementById("width")) === null || _a === void 0 ? void 0 : _a.value;
    const height = (_b = document.getElementById("height")) === null || _b === void 0 ? void 0 : _b.value;
    if (!width || !height) {
        alert("A width and height are required");
        return;
    }
    const pullStreamsResponse = yield pullStreams(Number(selectedCameraValue), Number(width), Number(height));
    if (pullStreamsResponse.status === "error") {
        alert(`Error: ${pullStreamsResponse.error}`);
    }
    else {
        const streamUrlLabel = document.querySelector('label[id="streamUrl"]');
        const snapshotUrlLabel = document.querySelector('label[id="snapshotUrl"]');
        if (!streamUrlLabel || !snapshotUrlLabel) {
            return;
        }
        streamUrlLabel.innerText = pullStreamsResponse["streamUrl"];
        snapshotUrlLabel.innerText = pullStreamsResponse["snapshotUrl"];
    }
});
// When button is pushed, copies the url to user's clipboard
const copyUrl = (urlType) => __awaiter(void 0, void 0, void 0, function* () {
    const urlLabel = document.getElementById(urlType);
    const url = urlLabel === null || urlLabel === void 0 ? void 0 : urlLabel.textContent;
    if (!urlLabel || !url) {
        alert("There was an issue with copying the url to the clipboard");
        return;
    }
    const tempInput = document.createElement("input");
    tempInput.setAttribute("type", "text");
    tempInput.setAttribute("value", url);
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
        const success = document.execCommand("copy");
        if (success) {
            alert("Content copied to clipboard");
        }
        else {
            throw new Error();
        }
    }
    catch (err) {
        alert("Failed to copy: " + err);
    }
    finally {
        document.body.removeChild(tempInput);
    }
});
