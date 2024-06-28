import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { loadPoseLandmarker } from "./poseLandmarker";
import AppContent from './AppContent';
import { calculateAngle, calculateDistance, calculateForceVectors, updateResults, displayResults } from './calculations';
import { analyzeShoulderPosition, analyzeElbowPosition, analyzeWristPosition, analyzeHipFlexion, analyzeLowerBackStrain, analyzeKneePosition, analyzeAnklePosition } from './analyzePositions';
import { analyzeShoulderRehab, analyzeElbowRehab, analyzeWristRehab, analyzeHipRehab, analyzeLowerBackRehab, analyzeKneeRehab, analyzeAnkleRehab } from './analyzeRehabPositions';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [bodyWeight, setBodyWeight] = useState('');
  const [additionalWeight, setAdditionalWeight] = useState('0');
  const [weightUnit, setWeightUnit] = useState('kg');
  const [isWebcamEnabled, setIsWebcamEnabled] = useState(false);
  const [forceVecResults, setForceVecResults] = useState([]);
  const [analysisMet, setAnalysisMet] = useState([]);
  const [shoulderAdvice, setShoulderAdvice] = useState('');
  const [elbowAdvice, setElbowAdvice] = useState('');
  const [wristAdvice, setWristAdvice] = useState('');
  const [lowerBackAdvice, setLowerBackAdvice] = useState('');
  const [hipAdvice, setHipAdvice] = useState('');
  const [kneeAdvice, setKneeAdvice] = useState('');
  const [ankleAdvice, setAnkleAdvice] = useState('');
  const [selectedInjuries, setSelectedInjuries] = useState([]);
  const [rehShoulderAdvice, setRehShoulderAdvice] = useState('');
  const [rehElbowAdvice, setRehElbowAdvice] = useState('');
  const [rehWristAdvice, setRehWristAdvice] = useState('');
  const [rehLowerBackAdvice, setRehLowerBackAdvice] = useState(''); 
  const [rehHipAdvice, setRehHipAdvice] = useState(''); 
  const [rehKneeAdvice, setRehKneeAdvice] = useState('');
  const [rehAnkleAdvice, setRehAnkleAdvice] = useState([]);
  const [selectedRehabInjuries, setSelectedRehabInjuries] = useState([]);

  const handleCheckboxChange = (event) => {
    const { name, value } = event.target;
    if (name === 'injOptions') {
      setSelectedInjuries((prevSelectedInjuries) =>
        prevSelectedInjuries.includes(value)
          ? prevSelectedInjuries.filter((inj) => inj !== value)
          : [...prevSelectedInjuries, value]
      );
    } else if (name === 'rehOptions') {
      setSelectedRehabInjuries((prevSelectedRehabInjuries) =>
        prevSelectedRehabInjuries.includes(value)
          ? prevSelectedRehabInjuries.filter((inj) => inj !== value)
          : [...prevSelectedRehabInjuries, value]
      );
    }
  };

  const handleEnablePredictions = () => {
    setIsWebcamEnabled(true);
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

    // Rehabilitation analysis
    const rehShoulderAdvice = analyzeShoulderRehab(combinedWristAngle, forwardLean);
    const rehElbowAdvice = analyzeElbowRehab(combinedElbowToShoulderDistance, combinedElbowToWristDistance);
    const rehWristAdvice = analyzeWristRehab(leftWristAngle, rightWristAngle);
    const rehLowerBackAdvice = analyzeLowerBackRehab(leanAngle, footWidth, combinedAnkleAngle);
    const rehHipAdvice = analyzeHipRehab(combinedHipAngle, combinedAnkleAngle, leanAngle);
    const rehKneeAdvice = analyzeKneeRehab(kneeAngle);
    const rehAnkleAdvice = analyzeAnkleRehab(combinedAnkleAngle);

    setRehShoulderAdvice(rehShoulderAdvice);
    setRehElbowAdvice(rehElbowAdvice);
    setRehWristAdvice(rehWristAdvice);
    setRehLowerBackAdvice(rehLowerBackAdvice);
    setRehHipAdvice(rehHipAdvice);
    setRehKneeAdvice(rehKneeAdvice);
    setRehAnkleAdvice(rehAnkleAdvice);
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
      wristAdvice={wristAdvice}
      lowerBackAdvice={lowerBackAdvice}
      hipAdvice={hipAdvice}
      kneeAdvice={kneeAdvice}
      ankleAdvice={ankleAdvice}
      handleCheckboxChange={handleCheckboxChange}
      selectedInjuries={selectedInjuries}
      handleEnablePredictions={handleEnablePredictions}
      selectedRehabInjuries={selectedRehabInjuries} // Pass selected rehab injuries
      rehShoulderAdvice={rehShoulderAdvice} // Pass shoulder rehab advice
      rehElbowAdvice={rehElbowAdvice} // Pass elbow rehab advice
      rehWristAdvice={rehWristAdvice} // Pass wrist rehab advice
      rehLowerBackAdvice={rehLowerBackAdvice} // Pass lower back rehab advice
      rehHipAdvice={rehHipAdvice} // Pass hip rehab advice
      rehKneeAdvice={rehKneeAdvice} // Pass knee rehab advice
      rehAnkleAdvice={rehAnkleAdvice} // Pass ankle rehab advice
    />
  );
}

export default App;
