// Rehabilitation analysis functions

// Analyze shoulder rehabilitation based on combined wrist angle and forward lean.
export const analyzeShoulderRehab = (combinedWristAngle, forwardLean) => {
  return combinedWristAngle > -0.1
      ? `Shoulder rehab: Focus on light weights and proper bar placement on the traps. Combined wrist to shoulder: ${combinedWristAngle.toFixed(2)}m.`
      : `Shoulder rehab: Avoid excessive lean, use support if necessary. Combined wrist to shoulder: ${combinedWristAngle.toFixed(2)}m. Leaning forward: ${forwardLean.toFixed(2)}m.`;
};

// Analyze elbow rehabilitation based on distances between elbow, shoulder, and wrist.
export const analyzeElbowRehab = (elbowToShoulderDistance, elbowToWristDistance) => {
  const ratio = elbowToWristDistance / elbowToShoulderDistance;
  return ratio < 1
      ? `Elbow rehab: Use light weights and ensure proper form. Ratio: ${ratio.toFixed(2)} (Elbow to wrist distance: ${elbowToWristDistance.toFixed(2)}m, Elbow to shoulder distance: ${elbowToShoulderDistance.toFixed(2)}m).`
      : `Elbow rehab: Avoid excessive forward tuck, use support if necessary. Ratio: ${ratio.toFixed(2)} (Elbow to wrist distance: ${elbowToWristDistance.toFixed(2)}m, Elbow to shoulder distance: ${elbowToShoulderDistance.toFixed(2)}m).`;
};

// Analyze wrist rehabilitation based on left and right wrist angles.
export const analyzeWristRehab = (leftWristAngle, rightWristAngle) => {
  const combinedWristAngle = Math.abs(Math.min(leftWristAngle, rightWristAngle) - 140);
  return combinedWristAngle === 0
      ? `Wrist rehab: Maintain light weights and proper stacking over elbows. Combined wrist angle: ${combinedWristAngle.toFixed(2)} degrees.`
      : `Wrist rehab: Use support to stack wrists over elbows correctly. Combined wrist angle: ${combinedWristAngle.toFixed(2)} degrees.`;
};

// Analyze hip rehabilitation based on hip angle, knee over toe angle, and lean angle.
export const analyzeHipRehab = (hipAngle, kneeOverToeAngle, leanAngle) => {
  return `Hip rehab: 
  \n- Use lighter weights and maintain proper foot positioning.
  \n- Ensure bar is placed correctly to reduce lean.
  \nCurrent hip angle: ${hipAngle.toFixed(2)} degrees
  \nCurrent knee over-toe angle: ${kneeOverToeAngle.toFixed(2)} degrees
  \nCurrent lean angle: ${leanAngle.toFixed(2)} degrees`;
};

// Analyze lower back rehabilitation based on lean angle, foot width, and ankle angle.
export const analyzeLowerBackRehab = (leanAngle, footWidth, ankleAngle) => {
  return `Lower back rehab: 
  \n- Use lighter weights and ensure correct foot placement.
  \n- Proper bar positioning to reduce lean and strain.
  \nCurrent lean: ${leanAngle.toFixed(2)} degrees
  \nFoot width: ${footWidth.toFixed(2)} meters
  \nKnee over-toe transition (ankle angle): ${ankleAngle.toFixed(2)} degrees`;
};

// Analyze knee rehabilitation based on knee angle.
export const analyzeKneeRehab = (kneeAngle) => {
  return kneeAngle > 90
      ? `Knee rehab: Use lighter weights and avoid large knee angles. Current angle: ${kneeAngle.toFixed(2)} degrees.`
      : `Knee rehab: Maintain proper form with light weights. Current angle: ${kneeAngle.toFixed(2)} degrees.`;
};

// Analyze ankle rehabilitation based on ankle angle.
export const analyzeAnkleRehab = (ankleAngle) => {
  return ankleAngle > 45
      ? `Ankle rehab: Use lighter weights and avoid large ankle angles. Current angle: ${ankleAngle.toFixed(2)} degrees.`
      : `Ankle rehab: Maintain proper form with light weights. Current angle: ${ankleAngle.toFixed(2)} degrees.`;
};
