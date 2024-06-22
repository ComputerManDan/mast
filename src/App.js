import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { loadPoseLandmarker } from "./components/poseLandmarker";
import AppContent from './AppContent';
import { calculateAngle, calculateDistance, calculateForceVectors, updateResults, displayResults } from './calculations';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [bodyWeight, setBodyWeight] = useState('');
  const [additionalWeight, setAdditionalWeight] = useState('');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [isWebcamEnabled, setIsWebcamEnabled] = useState(false);
  const [forceVecResults, setForceVecResults] = useState([]);
  const [analysisMet, setAnalysisMet] = useState([]);
  const [shoulderAdvice, setShoulderAdvice] = useState('');
  const [elbowAdvice, setElbowAdvice] = useState('');
  const [wristAdvice, setWristAdvice] = useState('');

  const analyzeShoulderPosition = (combinedWristAngle, forwardLean) => {
    let advice = '';
    if (combinedWristAngle > -0.1) {
      advice = `Shoulder advice: Place the bar on the traps of the back. Combined wrist to shoulder: ${combinedWristAngle.toFixed(2)}m.`;
    } else {
      advice = `Shoulder advice: Move the bar up or lean further forward with the squat. Combined wrist to shoulder: ${combinedWristAngle.toFixed(2)}m. Leaning forward: ${forwardLean.toFixed(2)}m.`;
    }

    return advice;
  };

  const analyzeElbowPosition = (elbowToShoulderDistance, elbowToWristDistance) => {
    let advice = '';
    const ratio = elbowToWristDistance / elbowToShoulderDistance;
    if (ratio < 1) {
      advice = `Elbow advice: Your elbow position is good. Ratio: ${ratio.toFixed(2)} (Elbow to wrist distance: ${elbowToWristDistance.toFixed(2)}m, Elbow to shoulder distance: ${elbowToShoulderDistance.toFixed(2)}m).`;
    } else {
      advice = `Elbow advice: Your elbows are too far tucked forward. Ratio: ${ratio.toFixed(2)} (Elbow to wrist distance: ${elbowToWristDistance.toFixed(2)}m, Elbow to shoulder distance: ${elbowToShoulderDistance.toFixed(2)}m).`;
    }
  
    return advice;
  };

  const analyzeWristPosition = (leftWristAngle, rightWristAngle) => {
    let advice = '';
    const combinedWristAngle = Math.abs(Math.min(leftWristAngle, rightWristAngle) - 140);
  
    if (combinedWristAngle === 0) {
      advice = `Wrist advice: Your wrists are properly stacked over the elbows. Combined wrist angle: ${combinedWristAngle.toFixed(2)} degrees.`;
    } else {
      advice = `Wrist advice: Your wrists need to be stacked over the elbows. Combined wrist angle: ${combinedWristAngle.toFixed(2)} degrees.`;
    }
  
    return advice;
  };

  const updateResultsCallback = useCallback((landmarks) => {
    updateResults(
      landmarks,
      calculateAngle,
      (jointData, combinedHipAngle, combinedKneeAngle, combinedAnkleAngle, shoulderUprightness, landmarks) =>
        calculateForceVectors(jointData, combinedHipAngle, combinedKneeAngle, combinedAnkleAngle, shoulderUprightness, landmarks, bodyWeight, additionalWeight, weightUnit, setForceVecResults, setAnalysisMet, calculateDistance),
      setResults,
      bodyWeight,
      additionalWeight,
      weightUnit,
      setForceVecResults,
      setAnalysisMet
    );
    // Shoulder analysis
    const leftWristAngle = calculateAngle(landmarks[13], landmarks[15], landmarks[11]);
    const rightWristAngle = calculateAngle(landmarks[14], landmarks[16], landmarks[12]);
    const combinedShoulderAngle = (landmarks[11].y + landmarks[12].y) / 2;
    const forwardLean = landmarks[23].y - landmarks[0].y;
  
    const leftElbowToShoulderDistance = calculateDistance(landmarks[13], landmarks[11]);
    const leftElbowToWristDistance = calculateDistance(landmarks[13], landmarks[15]);
    const rightElbowToShoulderDistance = calculateDistance(landmarks[14], landmarks[12]);
    const rightElbowToWristDistance = calculateDistance(landmarks[14], landmarks[16]);
  
    const combinedElbowToShoulderDistance = (leftElbowToShoulderDistance + rightElbowToShoulderDistance) / 2;
    const combinedElbowToWristDistance = (leftElbowToWristDistance + rightElbowToWristDistance) / 2;
  
    const shoulderAdvice = analyzeShoulderPosition(combinedShoulderAngle, combinedShoulderAngle, forwardLean);
    const elbowAdvice = analyzeElbowPosition(combinedElbowToShoulderDistance, combinedElbowToWristDistance);
    const wristAdvice = analyzeWristPosition(leftWristAngle, rightWristAngle);
  
    // Set shoulder, elbow, and wrist advice separately
    setShoulderAdvice(shoulderAdvice);
    setElbowAdvice(elbowAdvice);
    setWristAdvice(wristAdvice);
  }, [calculateAngle, calculateForceVectors, setResults, bodyWeight, additionalWeight, weightUnit, setForceVecResults, setAnalysisMet, calculateDistance]);

  const displayResultsCallback = useCallback((landmarksArray) => {
    displayResults(landmarksArray, updateResultsCallback, setResults);
  }, [updateResultsCallback, setResults]);
  

  useEffect(() => {
    const loadLandmarker = async () => {
      await loadPoseLandmarker(setIsWebcamEnabled, setLoading, displayResultsCallback, showSplash);
    };
    loadLandmarker();
  }, [showSplash, displayResultsCallback]);

  return (
    <AppContent
      showSplash={showSplash}
      setShowSplash={setShowSplash}
      bodyWeight={bodyWeight}
      setBodyWeight={setBodyWeight}
      additionalWeight={additionalWeight}
      setAdditionalWeight={setAdditionalWeight}
      weightUnit={weightUnit}
      setWeightUnit={setWeightUnit}
      isWebcamEnabled={isWebcamEnabled}
      setIsWebcamEnabled={setIsWebcamEnabled}
      loading={loading}
      results={results}
      forceVecResults={forceVecResults}
      analysisMet={analysisMet}
      shoulderAdvice={shoulderAdvice}
      elbowAdvice={elbowAdvice}
      wristAdvice={wristAdvice} // Pass wrist advice
    />
  );
};

export default App;
