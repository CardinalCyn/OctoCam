//pulls cameras, and sets them into the dropdown.
const setDropDown = async (): Promise<void> => {
  try {
    const rawResponse = await fetch("/get_cameras");
    if (rawResponse.status !== 200) {
      alert("Server error");
      return;
    }

    const response: SuccessfulPullCameraResponse | ErrorPullCameraResponse =
      await rawResponse.json();

    const select = document.querySelector(
      'select[name="userCameras"]'
    ) as HTMLSelectElement | null;
    if (response.status !== "successful") {
      alert("Error in pulling cameras: " + response.error);
      return;
    }

    const cameraKeys = Object.keys(response.cameras);
    if (!cameraKeys.length) alert("No cameras were found");
    for (const key of cameraKeys) {
      const option = document.createElement("option");
      option.text = key;
      option.value = response.cameras[key].toString();
      if (select) select.appendChild(option);
    }
  } catch (err) {
    console.log(err);
    alert(err);
  }
};

const pullStreams = async (
  selectedCameraValue: number,
  width: number,
  height: number
): Promise<SuccessfulPullStreamsResponse | ErrorPullStreamsResponse> => {
  try {
    //checks if server is online, and then will return snapshot and stream urls.
    const response = await fetch("/serverOnline");
    const responseJson = await response.json();
    if (responseJson.status !== "successful")
      return { status: "error", error: "Server is not online" };
    const hostResponse = await fetch("/get_ip");
    const hostJson = <{ ip: string; port: number }>await hostResponse.json();
    const streamUrl = `http://${hostJson.ip}:${hostJson.port}/stream/${selectedCameraValue}/${width}/${height}`;
    const snapshotUrl = `http://${hostJson.ip}:${hostJson.port}/snapshot/${selectedCameraValue}/${width}/${height}`;
    return {
      status: "successful",
      streamUrl: streamUrl,
      snapshotUrl: snapshotUrl,
    };
  } catch (err) {
    return { status: "error", error: JSON.stringify(err) };
  }
};

const pullLinks = async (event: Event | undefined): Promise<void> => {
  if (event) event.preventDefault();
  const selectedCameraElement = document.querySelector(
    'select[name="userCameras"]'
  ) as HTMLSelectElement | null;

  const selectedCameraValue = selectedCameraElement?.value;

  if (!selectedCameraElement) {
    alert("An invalid camera was selected");
    return;
  }
  const width = (document.getElementById("width") as HTMLInputElement | null)
    ?.value;
  const height = (document.getElementById("height") as HTMLInputElement | null)
    ?.value;
  if (!width || !height) {
    alert("A width and height are required");
    return;
  }
  const pullStreamsResponse = await pullStreams(
    Number(selectedCameraValue),
    Number(width),
    Number(height)
  );
  if (pullStreamsResponse.status === "error") {
    alert(`Error: ${pullStreamsResponse.error}`);
  } else {
    const streamUrlLabel = document.querySelector(
      'label[id="streamUrl"]'
    ) as HTMLLabelElement | null;
    const snapshotUrlLabel = document.querySelector(
      'label[id="snapshotUrl"]'
    ) as HTMLLabelElement | null;
    if (!streamUrlLabel || !snapshotUrlLabel) {
      return;
    }
    streamUrlLabel.innerText = pullStreamsResponse["streamUrl"];
    snapshotUrlLabel.innerText = pullStreamsResponse["snapshotUrl"];
  }
};
// When button is pushed, copies the url to user's clipboard
const copyUrl = async (urlType: "streamUrl" | "snapshotUrl"): Promise<void> => {
  const urlLabel = document.getElementById(urlType) as HTMLLabelElement | null;

  const url = urlLabel?.textContent;
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
    } else {
      throw new Error();
    }
  } catch (err) {
    alert("Failed to copy: " + err);
  } finally {
    document.body.removeChild(tempInput);
  }
};

type SuccessfulPullCameraResponse = {
  status: "successful";
  cameras: CameraMap;
};

type ErrorPullCameraResponse = {
  status: "error";
  error: unknown;
};

type SuccessfulPullStreamsResponse = {
  status: "successful";
  streamUrl: string;
  snapshotUrl: string;
};

type ErrorPullStreamsResponse = {
  status: "error";
  error: unknown;
};

type CameraMap = {
  [key: string]: number;
};
