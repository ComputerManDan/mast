import React, { useState, useEffect } from 'react';
import './App.css'; // Make sure to create an App.css file and add styles there

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!showSplash) {
      const loadPoseLandmarker = async () => {
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
            const canvas = document.createElement("canvas");
            canvas.setAttribute("class", "canvas");
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
            } else {
              webcamRunning = true;
              enableWebcamButton.innerText = "DISABLE PREDICTIONS";
              setLoading(true); // Set loading to true when starting to enable the webcam
            }

            const constraints = {
              video: true
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            video.srcObject = stream;
            video.addEventListener("loadeddata", () => {
              setLoading(false); // Set loading to false once the data is loaded
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
                canvasCtx.save();
                canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
                for (const landmark of result.landmarks) {
                  drawingUtils.drawLandmarks(landmark, {
                    radius: (data) => DrawingUtils.lerp(data.from.z, -0.15, 0.1, 5, 1)
                  });
                  drawingUtils.drawConnectors(landmark, PoseLandmarker.POSE_CONNECTIONS);
                }
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
      };

      loadPoseLandmarker();
    }
  }, [showSplash]);

  return (
    <div>
      {showSplash && (
        <div className="splash-screen" onClick={() => setShowSplash(false)}>
          <div className="splash-content">
            <img src="logomast.png" alt="Splash Backsground" className="splash-image" />
            <h2 className="splash-text">Tap to Continue</h2>
          </div>
        </div>
      )}
      {!showSplash && (
        <div>
          <h1>Musculoskeletal Analysis Squat Tool</h1>
          <section id="demos" className="invisible">
            <div id="liveView" className="videoView">
              <button id="webcamButton" className="mdc-button mdc-button--raised">
                <span className="mdc-button__ripple"></span>
                <span className="mdc-button__label">ENABLE WEBCAM</span>
              </button>
              <div style={{ position: 'relative', paddingTop: '1em'}}>
                <video id="webcam" style={{ width: '1280px', height: '720px', position: 'absolute' }} autoPlay playsInline></video>
                <canvas className="output_canvas" id="output_canvas" width="1280" height="720"></canvas>
                {loading && (
                  <div className="loading-overlay">
                    <p>Loading</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
