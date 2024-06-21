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
  const [shoulderAdvice, setShoulderAdvice] = useState(''); // New state for shoulder advice

  const analyzeShoulderPosition = (leftWrist, rightWrist, leftShoulder, rightShoulder) => {
    const leftWristToShoulder = leftWrist.y - leftShoulder.y;
    const rightWristToShoulder = rightWrist.y - rightShoulder.y;
  
    let advice = '';
    if (leftWristToShoulder > -0.1 && rightWristToShoulder > -0.1) {
      advice = 'Shoulder advice: Place the bar in the traps of the back.';
    } else {
      advice = 'Shoulder advice: Move the bar up or lean further forward with the squat.';
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
    const leftWrist = landmarks[15];
    const rightWrist = landmarks[16];
    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    
    const advice = analyzeShoulderPosition(leftWrist, rightWrist, leftShoulder, rightShoulder);

    // Set shoulder advice separately
    setShoulderAdvice(advice);
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
      shoulderAdvice={shoulderAdvice} // Pass shoulder advice
    />
  );
};

export default App;
