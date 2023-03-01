const pullCameras = async () => {
  //request to flask server for list of cameras
    const response = await fetch('/get_cameras');
    const cameraList = await response.json();
    return cameraList;
  };

const pullStreams=async(selectedCameraValue,width,height)=>{
  //checks if server is online, and then will return snapshot and stream urls.
    const response=await fetch('/serverOnline');
    const responseText=await response.json();
    if(responseText.status!=="successful") return "Error"
    const streamUrl = `http://127.0.0.1:8081/stream/${selectedCameraValue}/${width}/${height}`;
    const snapshotUrl = `http://127.0.0.1:8081/snapshot/${selectedCameraValue}/${width}/${height}`;
    return {streamUrl:streamUrl,snapshotUrl:snapshotUrl};
}