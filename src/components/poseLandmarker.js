export const loadPoseLandmarker = async (setIsWebcamEnabled, setLoading, displayResults, showSplash) => {
    if (!showSplash) {
      const demosSection = document.getElementById("demos");
  
      if (demosSection) {
        demosSection.classList.remove("invisible");
      }
  
      let poseLandmarker;
      let runningMode = "IMAGE";
      let enableWebcamButton;
      let webcamRunning = false;
      const videoHeight = "720px";
      const videoWidth = "1280px";
  
      const { PoseLandmarker, FilesetResolver, DrawingUtils } = await import("https://cdn.skypack.dev/@mediapipe/tasks-vision@0.10.0");
  
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
      );
      poseLandmarker = await PoseLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: `https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task`,
          delegate: "GPU"
        },
        runningMode: runningMode,
        numPoses: 2
      });
  
      const imageContainers = document.getElementsByClassName("detectOnClick");
      for (let i = 0; i < imageContainers.length; i++) {
        imageContainers[i].children[0].addEventListener("click", handleClick);
      }
  
      async function handleClick(event) {
        if (!poseLandmarker) {
          console.log("Wait for poseLandmarker to load before clicking!");
          return;
        }
  
        if (runningMode === "VIDEO") {
          runningMode = "IMAGE";
          await poseLandmarker.setOptions({ runningMode: "IMAGE" });
        }
  
        const allCanvas = event.target.parentNode.getElementsByClassName("canvas");
        for (let i = allCanvas.length - 1; i >= 0; i--) {
          const n = allCanvas[i];
          n.parentNode.removeChild(n);
        }
  
        poseLandmarker.detect(event.target, (result) => {
          console.log("Detection result:", result);
          const canvas = document.createElement("canvas");
          canvas.setAttribute("className", "canvas");
          canvas.setAttribute("width", event.target.naturalWidth + "px");
          canvas.setAttribute("height", event.target.naturalHeight + "px");
          canvas.style = `left: 0px; top: 0px; width: ${event.target.width}px; height: ${event.target.height}px;`;
  
          event.target.parentNode.appendChild(canvas);
          const canvasCtx = canvas.getContext("2d");
          const drawingUtils = new DrawingUtils(canvasCtx);
          for (const landmark of result.landmarks) {
            drawingUtils.drawLandmarks(landmark, {
              radius: (data) => DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1)
            });
            drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS);
          }
          displayResults(result.landmarks); // Call the function to update results
        });
      }
  
      const video = document.getElementById("webcam");
      const canvasElement = document.getElementById("output_canvas");
  
      if (canvasElement) {
        const canvasCtx = canvasElement.getContext("2d");
        const drawingUtils = new DrawingUtils(canvasCtx);
  
        const hasGetUserMedia = () => !!navigator.mediaDevices?.getUserMedia;
  
        if (hasGetUserMedia()) {
          enableWebcamButton = document.getElementById("webcamButton");
          enableWebcamButton.addEventListener("click", enableCam);
        } else {
          console.warn("getUserMedia() is not supported by your browser");
        }
  
        async function enableCam() {
          if (!poseLandmarker) {
            console.log("Wait! poseLandmaker not loaded yet.");
            return;
          }
  
          if (webcamRunning === true) {
            webcamRunning = false;
            enableWebcamButton.innerText = "ENABLE PREDICTIONS";
            setIsWebcamEnabled(false);
          } else {
            webcamRunning = true;
            enableWebcamButton.innerText = "STOP";
            setLoading(true);
            setIsWebcamEnabled(true);
          }
  
          const constraints = {
            video: true
          };
  
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          video.srcObject = stream;
          video.addEventListener("loadeddata", () => {
            setLoading(false);
            predictWebcam();
          });
        }
  
        let lastVideoTime = -1;
        async function predictWebcam() {
          if (!video.videoWidth || !video.videoHeight) {
            requestAnimationFrame(predictWebcam);
            return;
          }
  
          canvasElement.style.height = videoHeight;
          video.style.height = videoHeight;
          canvasElement.style.width = videoWidth;
          video.style.width = videoWidth;
  
          if (runningMode === "IMAGE") {
            runningMode = "VIDEO";
            await poseLandmarker.setOptions({ runningMode: "VIDEO" });
          }
  
          let startTimeMs = performance.now();
          if (lastVideoTime !== video.currentTime) {
            lastVideoTime = video.currentTime;
            poseLandmarker.detectForVideo(video, startTimeMs, (result) => {
              console.log("Video detection result:", result);
              canvasCtx.save();
              canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
              for (const landmark of result.landmarks) {
                drawingUtils.drawLandmarks(landmark, {
                  radius: (data) => DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1)
                });
                drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS);
              }
              displayResults(result.landmarks); // Call the function to update results
              canvasCtx.restore();
            });
          }
  
          if (webcamRunning === true) {
            window.requestAnimationFrame(predictWebcam);
          }
        }
      } else {
        console.error("output_canvas element not found");
      }
    }
  };
  