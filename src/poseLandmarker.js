// Load the pose landmarker and initialize webcam for pose detection.

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
        allCanvas[i].parentNode.removeChild(allCanvas[i]);
      }

      poseLandmarker.detect(event.target, (result) => {
        const canvas = document.createElement("canvas");
        canvas.setAttribute("className", "canvas");
        canvas.setAttribute("width", `${event.target.naturalWidth}px`);
        canvas.setAttribute("height", `${event.target.naturalHeight}px`);
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
          console.log("Wait! poseLandmarker not loaded yet.");
          return;
        }

        if (webcamRunning === true) {
          webcamRunning = false;
          enableWebcamButton.innerText = "ENABLE PREDICTIONS";
          setIsWebcamEnabled(false);
<<<<<<< HEAD
          
          // Stop all video tracks
          if (video.srcObject) {
            video.srcObject.getTracks().forEach(track => track.stop());
            video.srcObject = null;
          }
=======
>>>>>>> dacae9a69272962ed31447305702961b3eefa817
        } else {
          webcamRunning = true;
          enableWebcamButton.innerText = "STOP";
          setLoading(true);
          setIsWebcamEnabled(true);
<<<<<<< HEAD

          try {
            // Enhanced constraints for better mobile support
            const constraints = {
              video: {
                facingMode: "user",
                width: { ideal: 1280 },
                height: { ideal: 720 }
              },
              audio: false
            };

            console.log("Requesting camera access...");
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            console.log("Camera access granted");
            
            video.srcObject = stream;
            
            // For iOS compatibility - use onloadedmetadata instead of addEventListener
            video.onloadedmetadata = () => {
              console.log("Video metadata loaded");
              setLoading(false);
              if (webcamRunning) {
                predictWebcam();
              }
            };
            
            // Fallback in case onloadedmetadata doesn't fire immediately
            setTimeout(() => {
              if (webcamRunning && video.readyState >= 2) {
                console.log("Video ready via timeout");
                setLoading(false);
                predictWebcam();
              }
            }, 1000);
            
          } catch (error) {
            console.error("Error accessing camera:", error);
            webcamRunning = false;
            enableWebcamButton.innerText = "ENABLE PREDICTIONS";
            setIsWebcamEnabled(false);
            setLoading(false);
            
            // Provide user feedback
            let errorMessage = "Camera access denied. ";
            if (error.name === "NotAllowedError") {
              errorMessage += "Please allow camera access in your browser settings.";
            } else if (error.name === "NotFoundError") {
              errorMessage += "No camera device found.";
            } else if (error.name === "NotReadableError") {
              errorMessage += "Camera is already in use by another application.";
            } else if (error.name === "SecurityError") {
              errorMessage += "Camera access requires HTTPS connection.";
            }
            
            console.error("Error details:", {
              name: error.name,
              message: error.message
            });
            alert(errorMessage);
          }
        }
=======
        }

        const constraints = { video: { facingMode: "user" } };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
        video.addEventListener("loadeddata", () => {
          setLoading(false);
          predictWebcam();
        });
>>>>>>> dacae9a69272962ed31447305702961b3eefa817
      }

      let lastVideoTime = -1;
      async function predictWebcam() {
<<<<<<< HEAD
        if (!webcamRunning) {
          return;
        }

=======
>>>>>>> dacae9a69272962ed31447305702961b3eefa817
        if (!video.videoWidth || !video.videoHeight) {
          requestAnimationFrame(predictWebcam);
          return;
        }

        // Get responsive dimensions based on viewport
        const containerWidth = canvasElement.parentElement.clientWidth;
        const aspectRatio = video.videoWidth / video.videoHeight;
        const canvasWidth = Math.min(containerWidth, 1280);
        const canvasHeight = canvasWidth / aspectRatio;

        canvasElement.width = canvasWidth;
        canvasElement.height = canvasHeight;
        video.width = canvasWidth;
        video.height = canvasHeight;

        canvasElement.style.height = canvasHeight + "px";
        video.style.height = canvasHeight + "px";
        canvasElement.style.width = canvasWidth + "px";
        video.style.width = canvasWidth + "px";

        if (runningMode === "IMAGE") {
          runningMode = "VIDEO";
          await poseLandmarker.setOptions({ runningMode: "VIDEO" });
        }

        const startTimeMs = performance.now();
        if (lastVideoTime !== video.currentTime) {
          lastVideoTime = video.currentTime;
          poseLandmarker.detectForVideo(video, startTimeMs, (result) => {
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