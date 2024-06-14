import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [bodyWeight, setBodyWeight] = useState('');
  const [additionalWeight, setAdditionalWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [isWebcamEnabled, setIsWebcamEnabled] = useState(false);

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
            console.log("Detection result:", result);
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
              enableWebcamButton.innerText = "DISABLE PREDICTIONS";
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
      };

      loadPoseLandmarker();
    }
  }, [showSplash]);

  const calculateAngle = (A, B, C) => {
    const AB = { x: B.x - A.x, y: B.y - A.y, z: B.z - A.z };
    const BC = { x: C.x - B.x, y: C.y - B.y, z: C.z - B.z };
  
    const dotProduct = AB.x * BC.x + AB.y * BC.y + AB.z * BC.z;
    const magnitudeAB = Math.sqrt(AB.x * AB.x + AB.y * AB.y + AB.z * AB.z);
    const magnitudeBC = Math.sqrt(BC.x * BC.x + BC.y * BC.y + BC.z * BC.z);
  
    const angleRadians = Math.acos(dotProduct / (magnitudeAB * magnitudeBC));
    return angleRadians * 180 / Math.PI; // Convert to degrees
  };
  const displayResults = (landmarksArray) => {
    if (!landmarksArray || landmarksArray.length === 0 || !landmarksArray[0].length) {
      setResults(["No landmarks detected"]);
      return;
    }
  
    const landmarks = landmarksArray[0]; // Access the first set of landmarks directly
  
    // Calculate the front view head angle using eyes and nose
    const nose = landmarks[0];
    const leftEye = landmarks[1];
    const rightEye = landmarks[4];
    const averageEyeY = (leftEye.y + rightEye.y) / 2;
    const frontViewAngleRadians = Math.atan2(nose.y - averageEyeY, nose.z - (leftEye.z + rightEye.z) / 2);
    const frontViewAngleDegrees = frontViewAngleRadians * 180 / Math.PI; // Convert to degrees
  
    // Calculate the side view head angle using nose and shoulders
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const averageShoulderY = (leftShoulder.y + rightShoulder.y) / 2;
    const sideViewAngleRadians = Math.atan2(nose.y - averageShoulderY, nose.x - (leftShoulder.x + rightShoulder.x) / 2);
    const sideViewAngleDegrees = sideViewAngleRadians * 180 / Math.PI; // Convert to degrees
  
    // Use the provided adjusted angles directly
    const adjustedFrontViewAngle = frontViewAngleDegrees - 120;
    const adjustedSideViewAngle = sideViewAngleDegrees + 80;
  
    // Determine the dynamic adjustment based on the front view angle  
    let combinedAngleDegrees = ((adjustedFrontViewAngle + adjustedSideViewAngle) / 2).toFixed(2);
  
    // Calculate angles for each category
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    const leftElbow = landmarks[13];
    const rightElbow = landmarks[14];
    const leftWrist = landmarks[15];
    const rightWrist = landmarks[16];
    const leftKnee = landmarks[25];
    const rightKnee = landmarks[26];
    const leftAnkle = landmarks[27];
    const rightAnkle = landmarks[28];
    const leftHeel = landmarks[29];
    const rightHeel = landmarks[30];
    const leftFootIndex = landmarks[31];
    const rightFootIndex = landmarks[32];
  
    // Shoulder uprightness (spine)
    const shoulderUprightness = calculateAngle(leftHip, leftShoulder, rightShoulder);
  
    // Elbows (torque against the joint)
    const leftElbowAngle = calculateAngle(leftWrist, leftElbow, leftShoulder);
    const rightElbowAngle = calculateAngle(rightWrist, rightElbow, rightShoulder);
  
    // Wrists (stacked over the elbows)
    const leftWristAngle = calculateAngle(leftElbow, leftWrist, leftShoulder);
    const rightWristAngle = calculateAngle(rightElbow, rightWrist, rightShoulder);
  
    // Combined wrist angle: Take the lowest wrist angle and subtract 140, but not below 0
    let combinedWristAngle = Math.min(leftWristAngle, rightWristAngle) - 140;

    // Combined elbow angle: Take the lowest elbow angle and subtract 30, but not below 0
    let combinedElbowAngle = Math.min(leftElbowAngle, rightElbowAngle) - 30;
    combinedElbowAngle = combinedElbowAngle < 0 ? 0 : combinedElbowAngle;
  
    // Determine the dynamic adjustment based on the front view angle for hips and knees
    const hipKneeAdjustment = (40 * (20 - Math.abs(adjustedSideViewAngle)) / 20).toFixed(2); // Adjusts from -30 at 0 degrees to 0 at 90 degrees

    // Hips (angle at the hip joint)
    const leftHipAngle = calculateAngle(leftShoulder, leftHip, leftKnee);
    const rightHipAngle = calculateAngle(rightShoulder, rightHip, rightKnee);
    let combinedHipAngle = (leftHipAngle + rightHipAngle) / 2;
    if (Math.abs(adjustedSideViewAngle) < 20) {
      combinedHipAngle -= hipKneeAdjustment;
    }
    
    // Knees (angle at the knee joint)
    const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftHeel);
    const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightHeel);
    let combinedKneeAngle = (leftKneeAngle + rightKneeAngle) / 2;
    if (Math.abs(adjustedSideViewAngle) < 20) {
      combinedKneeAngle -= hipKneeAdjustment;
    }

    // Ensure the combined angles are not negative
    combinedHipAngle = combinedHipAngle < 0 ? 0 : combinedHipAngle;
    combinedKneeAngle = combinedKneeAngle < 0 ? 0 : combinedKneeAngle;
  
    // Ankles (angle at the ankle joint)
    const leftAnkleAngle = calculateAngle(leftKnee, leftAnkle, leftHeel);
    const rightAnkleAngle = calculateAngle(rightKnee, rightAnkle, rightHeel);
    const combinedAnkleAngle = (leftAnkleAngle + rightAnkleAngle) / 2;
  
    // Feet (angle relative to the knees)
    const leftFootAngle = calculateAngle(leftKnee, leftHeel, leftFootIndex);
    const rightFootAngle = calculateAngle(rightKnee, rightHeel, rightFootIndex);
    const combinedFootAngle = (leftFootAngle + rightFootAngle) / 2;

  const formattedResults = [
    `Head angle: ${combinedAngleDegrees} degrees (Front view: ${adjustedFrontViewAngle.toFixed(2)}, Side view: ${adjustedSideViewAngle.toFixed(2)})`,
    `Spinal uprightness / Shoulder torque: ${shoulderUprightness.toFixed(2)} degrees`,
    `Combined elbow angle: ${combinedElbowAngle.toFixed(2)} degrees (Left elbow angle: ${leftElbowAngle.toFixed(2)} degrees) (Right elbow angle: ${rightElbowAngle.toFixed(2)} degrees)`,
    `Combined wrist angle: ${combinedWristAngle.toFixed(2)} degrees (Left wrist angle: ${leftWristAngle.toFixed(2)} degrees) (Right wrist angle: ${rightWristAngle.toFixed(2)} degrees)`,
    `Combined hip angle: ${combinedHipAngle.toFixed(2)} degrees (Left hip angle: ${leftHipAngle.toFixed(2)} degrees) (Right hip angle: ${rightHipAngle.toFixed(2)} degrees)`,
    `Combined knee angle: ${combinedKneeAngle.toFixed(2)} degrees (Left knee angle: ${leftKneeAngle.toFixed(2)} degrees) (Right knee angle: ${rightKneeAngle.toFixed(2)} degrees)`,
    `Combined ankle angle: ${combinedAnkleAngle.toFixed(2)} degrees (Left ankle angle: ${leftAnkleAngle.toFixed(2)} degrees) (Right ankle angle: ${rightAnkleAngle.toFixed(2)} degrees)`,
    `Combined foot angle: ${combinedFootAngle.toFixed(2)} degrees (Left foot angle: ${leftFootAngle.toFixed(2)} degrees) (Right foot angle: ${rightFootAngle.toFixed(2)} degrees)`
  ];

  setResults(formattedResults);
  
};
  
  return (
    <div>
      {showSplash && (
        <div className="splash-screen" onClick={() => setShowSplash(false)}>
          <div className="splash-content">
            <img src="exeter.jpg" alt="Exeter University Background" id="splash-uni"/>
            <img src="logomast.png" alt="Splash Background" className="splash-image" />
            <h2 className="splash-text">Tap to Continue</h2>
          </div>
        </div>
      )}
      {!showSplash && (
        <div className="wrapper">
          <header>
            <h1>Musculoskeletal Analysis Squat Tool</h1>
          </header>
          <section>
            <div className="button-group">
              <button id="athButton" className="mdc-button mdc-button--raised">
                <span className="mdc-button__label">Athletic performance</span>
              </button>
              <div className="dropdown">
                <button id="injButton" className="mdc-button mdc-button--raised dropdown-toggle">
                  <span className="mdc-button__label">Injury prevention</span>
                </button>
                <div className="dropdown-content">
                  <label><input type="checkbox" name="injOptions" value="shoulders" /> Shoulders</label>
                  <label><input type="checkbox" name="injOptions" value="elbows" /> Elbows</label>
                  <label><input type="checkbox" name="injOptions" value="wrists" /> Wrists</label>
                  <label><input type="checkbox" name="injOptions" value="hips" /> Hips</label>
                  <label><input type="checkbox" name="injOptions" value="knees" /> Knees</label>
                  <label><input type="checkbox" name="injOptions" value="ankles" /> Ankles</label>
                </div>
              </div>
              <div className="dropdown">
                <button id="rehButton" className="mdc-button mdc-button--raised dropdown-toggle">
                  <span className="mdc-button__label">Injury Rehabilitation</span>
                </button>
                <div className="dropdown-content">
                  <label><input type="checkbox" name="rehOptions" value="shoulders" /> Shoulders</label>
                  <label><input type="checkbox" name="rehOptions" value="elbows" /> Elbows</label>
                  <label><input type="checkbox" name="rehOptions" value="wrists" /> Wrists</label>
                  <label><input type="checkbox" name="rehOptions" value="hips" /> Hips</label>
                  <label><input type="checkbox" name="rehOptions" value="knees" /> Knees</label>
                  <label><input type="checkbox" name="rehOptions" value="ankles" /> Ankles</label>
                </div>
              </div>
            </div>
          </section>
          <main id="demos" className="invisible">
            <button id="webcamButton" className="mdc-button mdc-button--raised">
              <span className="mdc-button__ripple"></span>
              <span className="mdc-button__label">ENABLE WEBCAM</span>
            </button>
            <div id="weights">
              <label class="weightLabel">
                Body Weight:
                <input type="number" value={bodyWeight} onChange={(e) => setBodyWeight(e.target.value)} class="inputs"/>
              </label>
              <label class="weightLabel">
                Additional Weight:
                <input type="number" value={additionalWeight} onChange={(e) => setAdditionalWeight(e.target.value)} class="inputs"/>
              </label>
              <label class="weightLabel">
                Unit:
                <select value={weightUnit} onChange={(e) => setWeightUnit(e.target.value)} class="inputs">
                  <option value="kg">Kg</option>
                  <option value="lbs">Lbs</option>
                </select>
              </label>
            </div>
            <div id="video">
              {!isWebcamEnabled && <img src="logomast.png" alt="Placeholder" style={{ width: '1280px', height: '720px' }} />}
              <video id="webcam" style={{ width: '1280px', height: '720px', position: isWebcamEnabled ? 'absolute' : 'relative', display: isWebcamEnabled ? 'block' : 'none' }} autoPlay playsInline></video>
              <canvas className="output_canvas" id="output_canvas" width="1280" height="720" style={{ display: isWebcamEnabled && !loading ? 'block' : 'none' }}></canvas>
              {loading && (
                <div className="loading-background">
                  <div className="loading-overlay">
                    <p>Loading</p>
                  </div>
                </div>
              )}
            </div>
          </main>
          <section>
            <h2>Results</h2>
            <div className="results">
              {results.map((result, index) => (
                <p key={index}>{result}</p>
              ))}
            </div>
          </section>
          <footer>
            <p>&copy; 2024 Musculoskeletal Analysis Squat Tool. All rights reserved. For inquiries, contact us at <a href="mailto:di236@exeter.ac.uk">di236@exeter.ac.uk</a>.</p>
          </footer>
        </div>
      )}
    </div>
  );
}

export default App;
