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
  const [lowerBackAdvice, setLowerBackAdvice] = useState(''); // New state for lower back advice
  const [hipAdvice, setHipAdvice] = useState(''); // New state for hip advice
  const [kneeAdvice, setKneeAdvice] = useState('');
  const [ankleAdvice, setAnkleAdvice] = useState('');
  const [selectedInjuries, setSelectedInjuries] = useState([]);

  const handleCheckboxChange = (event) => {
    const value = event.target.value;
    setSelectedInjuries((prevSelectedInjuries) =>
      prevSelectedInjuries.includes(value)
        ? prevSelectedInjuries.filter((inj) => inj !== value)
        : [...prevSelectedInjuries, value]
    );
  };

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

  const analyzeHipFlexion = (hipAngle, kneeOverToeAngle, leanAngle) => {
    let advice = `Hip advice: To reduce hip pressure:
      \n- Move your feet closer together for increased knee over-toe translation.
      \n- Move the bar higher up on your back to reduce the amount of lean required.`;
  
    advice += `\nCurrent hip angle: ${hipAngle.toFixed(2)} degrees`;
    advice += `\nCurrent knee over-toe angle: ${kneeOverToeAngle.toFixed(2)} degrees`;
    advice += `\nCurrent lean angle: ${leanAngle.toFixed(2)} degrees`;
  
    return advice;
  };

  const analyzeLowerBackStrain = (leanAngle, footWidth, ankleAngle) => {
    let advice = `Lower back advice: To reduce strain:
      \n- Position your feet more forward for increased knee over-toe translation.
      \n- Move the bar up higher on your back to reduce the lean required to keep the bar over the center line of the lift.`;
  
    advice += `\nCurrent lean: ${leanAngle.toFixed(2)} degrees`;
    advice += `\nFoot width: ${footWidth.toFixed(2)} meters`;
    advice += `\nKnee over-toe transition (ankle angle): ${ankleAngle.toFixed(2)} degrees`;
  
    return advice;
  };

  const analyzeKneePosition = (kneeAngle) => {
    // Placeholder analysis logic for knees
    let advice = '';
    if (kneeAngle > 90) {
      advice = `Knee advice: Your knee angle is too large. Current angle: ${kneeAngle.toFixed(2)} degrees.`;
    } else {
      advice = `Knee advice: Your knee angle is appropriate. Current angle: ${kneeAngle.toFixed(2)} degrees.`;
    }
    return advice;
  };
  
  const analyzeAnklePosition = (ankleAngle) => {
    // Placeholder analysis logic for ankles
    let advice = '';
    if (ankleAngle > 45) {
      advice = `Ankle advice: Your ankle angle is too large. Current angle: ${ankleAngle.toFixed(2)} degrees.`;
    } else {
      advice = `Ankle advice: Your ankle angle is appropriate. Current angle: ${ankleAngle.toFixed(2)} degrees.`;
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
    
    // Calculate angles
    const leanAngle = Math.abs(calculateAngle(landmarks[11], landmarks[23], landmarks[0])); // Angle between shoulder, hip, and nose
    const footWidth = calculateDistance(landmarks[31], landmarks[32]); // Distance between left and right foot index
    const leftAnkleAngle = calculateAngle(landmarks[25], landmarks[27], landmarks[31]);
    const rightAnkleAngle = calculateAngle(landmarks[26], landmarks[28], landmarks[32]);
    const combinedAnkleAngle = (leftAnkleAngle + rightAnkleAngle) / 2;
    const leftHipAngle = calculateAngle(landmarks[11], landmarks[23], landmarks[25]);
    const rightHipAngle = calculateAngle(landmarks[12], landmarks[24], landmarks[26]);
    const combinedHipAngle = (leftHipAngle + rightHipAngle) / 2;
    const kneeAngle = (calculateAngle(landmarks[23], landmarks[25], landmarks[27]) + calculateAngle(landmarks[24], landmarks[26], landmarks[28])) / 2;

    // Lower back analysis
    const lowerBackAdvice = analyzeLowerBackStrain(leanAngle, footWidth, combinedAnkleAngle);
  
    // Shoulder, elbow, and wrist analysis (existing)
    const combinedWristAngle = (landmarks[15].y + landmarks[16].y) / 2 - (landmarks[11].y + landmarks[12].y) / 2;
    const combinedShoulderAngle = (landmarks[11].y + landmarks[12].y) / 2;
    const forwardLean = landmarks[23].y - landmarks[0].y;
  
    const leftElbowToShoulderDistance = calculateDistance(landmarks[13], landmarks[11]);
    const leftElbowToWristDistance = calculateDistance(landmarks[13], landmarks[15]);
    const rightElbowToShoulderDistance = calculateDistance(landmarks[14], landmarks[12]);
    const rightElbowToWristDistance = calculateDistance(landmarks[14], landmarks[16]);
  
    const leftWristAngle = calculateAngle(landmarks[11], landmarks[13], landmarks[15]);
    const rightWristAngle = calculateAngle(landmarks[12], landmarks[14], landmarks[16]);

    const combinedElbowToShoulderDistance = (leftElbowToShoulderDistance + rightElbowToShoulderDistance) / 2;
    const combinedElbowToWristDistance = (leftElbowToWristDistance + rightElbowToWristDistance) / 2;
  
    const shoulderAdvice = analyzeShoulderPosition(combinedWristAngle, combinedShoulderAngle, forwardLean);
    const elbowAdvice = analyzeElbowPosition(combinedElbowToShoulderDistance, combinedElbowToWristDistance);
    const wristAdvice = analyzeWristPosition(leftWristAngle, rightWristAngle);
    const hipAdvice = analyzeHipFlexion(combinedHipAngle, combinedAnkleAngle, leanAngle);
    const kneeAdvice = analyzeKneePosition(kneeAngle);
    const ankleAdvice = analyzeAnklePosition(combinedAnkleAngle);

    // Set shoulder, elbow, wrist, lower back, and hip advice separately
    setShoulderAdvice(shoulderAdvice);
    setElbowAdvice(elbowAdvice);
    setWristAdvice(wristAdvice);
    setLowerBackAdvice(lowerBackAdvice);
    setHipAdvice(hipAdvice);
    setKneeAdvice(kneeAdvice);
    setAnkleAdvice(ankleAdvice);
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
      lowerBackAdvice={lowerBackAdvice} // Pass lower back advice
      hipAdvice={hipAdvice} // Pass hip advice
      kneeAdvice={kneeAdvice} // Pass knee advice
      ankleAdvice={ankleAdvice} // Pass ankle advice
      handleCheckboxChange={handleCheckboxChange} // Pass the handler to AppContent
      selectedInjuries={selectedInjuries}
    />
  );
};

export default App;