import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import SplashScreen from './components/SplashScreen';
import { loadPoseLandmarker } from "./components/poseLandmarker";
import FirstSection from './components/FirstSection';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [bodyWeight, setBodyWeight] = useState('');
  const [additionalWeight, setAdditionalWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [isWebcamEnabled, setIsWebcamEnabled] = useState(false);
  const [forceVecResults, setForceVecResults] = useState([]); // Added this state for storing the force vector results

  const calculateAngle = useCallback((A, B, C) => {
    const AB = { x: B.x - A.x, y: B.y - A.y, z: B.z - A.z };
    const BC = { x: C.x - B.x, y: C.y - B.y, z: C.z - B.z };
  
    const dotProduct = AB.x * BC.x + AB.y * BC.y + AB.z * BC.z;
    const magnitudeAB = Math.sqrt(AB.x * AB.x + AB.y * AB.y + AB.z * AB.z);
    const magnitudeBC = Math.sqrt(BC.x * BC.x + BC.y * BC.y + BC.z * BC.z);
  
    const angleRadians = Math.acos(dotProduct / (magnitudeAB * magnitudeBC));
    return angleRadians * 180 / Math.PI; // Convert to degrees
  }, []);
  

  const calculateForceVectors = useCallback((jointData) => {
    const totalWeight = parseFloat(bodyWeight) + parseFloat(additionalWeight);
    const weightMultiplier = weightUnit === 'lbs' ? 0.453592 : 1; // Convert lbs to kg if needed
    const weightInKg = totalWeight * weightMultiplier;
  
    const forceVectors = jointData.map(({ joint, angle }) => {
      const force = weightInKg * (angle / 180);
      return `${joint}: ${force.toFixed(2)} kg at ${angle.toFixed(2)} degrees`;
    });
  
    setForceVecResults(forceVectors);
  }, [bodyWeight, additionalWeight, weightUnit]);
  
  
  const displayResults = useCallback((landmarksArray) => {
    if (!landmarksArray || landmarksArray.length === 0 || !landmarksArray[0].length) {
      setResults(["No landmarks detected"]);
      return;
    }
  
    const landmarks = landmarksArray[0]; // Access the first set of landmarks directly
  
    const nose = landmarks[0];
    const leftEye = landmarks[1];
    const rightEye = landmarks[4];
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
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
  
    const averageEyeY = (leftEye.y + rightEye.y) / 2;
    const frontViewAngleRadians = Math.atan2(nose.y - averageEyeY, nose.z - (leftEye.z + rightEye.z) / 2);
    const frontViewAngleDegrees = frontViewAngleRadians * 180 / Math.PI; // Convert to degrees
  
    // Calculate the side view head angle using nose and shoulders
    const averageShoulderY = (leftShoulder.y + rightShoulder.y) / 2;
    const sideViewAngleRadians = Math.atan2(nose.y - averageShoulderY, nose.x - (leftShoulder.x + rightShoulder.x) / 2);
    const sideViewAngleDegrees = sideViewAngleRadians * 180 / Math.PI; // Convert to degrees
  
    // Use the provided adjusted angles directly
    const adjustedFrontViewAngle = frontViewAngleDegrees - 120;
    const adjustedSideViewAngle = sideViewAngleDegrees + 80;
  
    // Determine the dynamic adjustment based on the front view angle  
    let combinedAngleDegrees = ((adjustedFrontViewAngle + adjustedSideViewAngle) / 2).toFixed(2);
  
    // Shoulder uprightness (spine)
    const shoulderUprightness = calculateAngle(leftHip, leftShoulder, rightShoulder);
  
    // Elbows (torque against the joint)
    const leftElbowAngle = calculateAngle(leftWrist, leftElbow, leftShoulder);
    const rightElbowAngle = calculateAngle(rightWrist, rightElbow, rightShoulder);
  
    // Wrists (stacked over the elbows)
    const leftWristAngle = calculateAngle(leftElbow, leftWrist, leftShoulder);
    const rightWristAngle = calculateAngle(rightElbow, rightWrist, rightShoulder);
  
    // Combined wrist angle: Take the lowest wrist angle and subtract 140, but not below 0
    let combinedWristAngle = Math.abs(Math.min(leftWristAngle, rightWristAngle) - 140);
  
    // Combined elbow angle: Take the lowest elbow angle and subtract 30, but not below 0
    let combinedElbowAngle = Math.min(leftElbowAngle, rightElbowAngle);
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
  
    const jointData = [
      { joint: 'Hip', angle: combinedHipAngle },
      { joint: 'Knee', angle: combinedKneeAngle },
      { joint: 'Ankle', angle: combinedAnkleAngle },
    ];
  
    calculateForceVectors(jointData);
  
    const formattedResults = [
      `Head angle: ${Number(combinedAngleDegrees).toFixed(2)} degrees (Front view: ${Number(adjustedFrontViewAngle).toFixed(2)}, Side view: ${Number(adjustedSideViewAngle).toFixed(2)})`,
      `Spinal uprightness / Shoulder torque: ${Number(shoulderUprightness).toFixed(2)} degrees`,
      `Combined elbow angle: ${Number(combinedElbowAngle).toFixed(2)} degrees (Left elbow angle: ${Number(leftElbowAngle).toFixed(2)} degrees) (Right elbow angle: ${Number(rightElbowAngle).toFixed(2)} degrees)`,
      `Combined wrist angle: ${Number(combinedWristAngle).toFixed(2)} degrees (Left wrist angle: ${Number(leftWristAngle).toFixed(2)} degrees) (Right wrist angle: ${Number(rightWristAngle).toFixed(2)} degrees)`,
      `Combined hip angle: ${Number(combinedHipAngle).toFixed(2)} degrees (Left hip angle: ${Number(leftHipAngle).toFixed(2)} degrees) (Right hip angle: ${Number(rightHipAngle).toFixed(2)} degrees)`,
      `Combined knee angle: ${Number(combinedKneeAngle).toFixed(2)} degrees (Left knee angle: ${Number(leftKneeAngle).toFixed(2)} degrees) (Right knee angle: ${Number(rightKneeAngle).toFixed(2)} degrees)`,
      `Combined ankle angle: ${Number(combinedAnkleAngle).toFixed(2)} degrees (Left ankle angle: ${Number(leftAnkleAngle).toFixed(2)} degrees) (Right ankle angle: ${Number(rightAnkleAngle).toFixed(2)} degrees)`,
      `Combined foot angle: ${Number(combinedFootAngle).toFixed(2)} degrees (Left foot angle: ${Number(leftFootAngle).toFixed(2)} degrees) (Right foot angle: ${Number(rightFootAngle).toFixed(2)} degrees)`,
    ];
  
    setResults(formattedResults);
  }, [calculateAngle, calculateForceVectors]);
  

  useEffect(() => {
    const loadLandmarker = async () => {
      await loadPoseLandmarker(setIsWebcamEnabled, setLoading, displayResults, showSplash);
    };
    loadLandmarker();
  }, [showSplash, displayResults]);

  return (
    <div>
      {showSplash && <SplashScreen setShowSplash={setShowSplash} />}
      {!showSplash && (
        <div className="wrapper">
          <header>
            <h1>Musculoskeletal Analysis Squat Tool</h1>
          </header>
          <FirstSection />
          <main id="demos" className="invisible">
            <button id="webcamButton" className="mdc-button mdc-button--raised">
              <span className="mdc-button__ripple"></span>
              <span className="mdc-button__label">ENABLE WEBCAM</span>
            </button>
            <div id="weights">
              <label className="weightLabel">
                Body Weight:
                <input
                  type="number"
                  value={bodyWeight}
                  onChange={(e) => setBodyWeight(e.target.value)}
                  className="inputs"
                  disabled={isWebcamEnabled}
                />
              </label>
              <label className="weightLabel">
                Additional Weight:
                <input
                  type="number"
                  value={additionalWeight}
                  onChange={(e) => setAdditionalWeight(e.target.value)}
                  className="inputs"
                  disabled={isWebcamEnabled}
                />
              </label>
              <label className="weightLabel">
                Unit:
                <select
                  value={weightUnit}
                  onChange={(e) => setWeightUnit(e.target.value)}
                  className="inputs"
                  disabled={isWebcamEnabled}
                >
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
              <div className="angles">
                {results.map((result, index) => (
                  <p key={index}>{result}</p>
                ))}
              </div>
              <div className="forceVec">
                {forceVecResults.map((result, index) => (
                  <p key={index}>{result}</p>
                ))}
              </div>
              <div className="analysisMet">
              </div>
              <div className="analysisWords">
              </div>
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
