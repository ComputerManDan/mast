// Rehabilitation analysis functions

export const analyzeShoulderRehab = (combinedWristAngle, forwardLean) => {
    let advice = '';
    if (combinedWristAngle > -0.1) {
      advice = `Shoulder rehab: Focus on light weights and proper bar placement on the traps. Combined wrist to shoulder: ${combinedWristAngle.toFixed(2)}m.`;
    } else {
      advice = `Shoulder rehab: Avoid excessive lean, use support if necessary. Combined wrist to shoulder: ${combinedWristAngle.toFixed(2)}m. Leaning forward: ${forwardLean.toFixed(2)}m.`;
    }
    return advice;
  };
  
  export const analyzeElbowRehab = (elbowToShoulderDistance, elbowToWristDistance) => {
    let advice = '';
    const ratio = elbowToWristDistance / elbowToShoulderDistance;
    if (ratio < 1) {
      advice = `Elbow rehab: Use light weights and ensure proper form. Ratio: ${ratio.toFixed(2)} (Elbow to wrist distance: ${elbowToWristDistance.toFixed(2)}m, Elbow to shoulder distance: ${elbowToShoulderDistance.toFixed(2)}m).`;
    } else {
      advice = `Elbow rehab: Avoid excessive forward tuck, use support if necessary. Ratio: ${ratio.toFixed(2)} (Elbow to wrist distance: ${elbowToWristDistance.toFixed(2)}m, Elbow to shoulder distance: ${elbowToShoulderDistance.toFixed(2)}m).`;
    }
    return advice;
  };
  
  export const analyzeWristRehab = (leftWristAngle, rightWristAngle) => {
    let advice = '';
    const combinedWristAngle = Math.abs(Math.min(leftWristAngle, rightWristAngle) - 140);
  
    if (combinedWristAngle === 0) {
      advice = `Wrist rehab: Maintain light weights and proper stacking over elbows. Combined wrist angle: ${combinedWristAngle.toFixed(2)} degrees.`;
    } else {
      advice = `Wrist rehab: Use support to stack wrists over elbows correctly. Combined wrist angle: ${combinedWristAngle.toFixed(2)} degrees.`;
    }
    return advice;
  };
  
  export const analyzeHipRehab = (hipAngle, kneeOverToeAngle, leanAngle) => {
    let advice = `Hip rehab: 
      \n- Use lighter weights and maintain proper foot positioning.
      \n- Ensure bar is placed correctly to reduce lean.`;
    
    advice += `\nCurrent hip angle: ${hipAngle.toFixed(2)} degrees`;
    advice += `\nCurrent knee over-toe angle: ${kneeOverToeAngle.toFixed(2)} degrees`;
    advice += `\nCurrent lean angle: ${leanAngle.toFixed(2)} degrees`;
    return advice;
  };
  
  export const analyzeLowerBackRehab = (leanAngle, footWidth, ankleAngle) => {
    let advice = `Lower back rehab: 
      \n- Use lighter weights and ensure correct foot placement.
      \n- Proper bar positioning to reduce lean and strain.`;
    
    advice += `\nCurrent lean: ${leanAngle.toFixed(2)} degrees`;
    advice += `\nFoot width: ${footWidth.toFixed(2)} meters`;
    advice += `\nKnee over-toe transition (ankle angle): ${ankleAngle.toFixed(2)} degrees`;
    return advice;
  };
  
  export const analyzeKneeRehab = (kneeAngle) => {
    let advice = '';
    if (kneeAngle > 90) {
      advice = `Knee rehab: Use lighter weights and avoid large knee angles. Current angle: ${kneeAngle.toFixed(2)} degrees.`;
    } else {
      advice = `Knee rehab: Maintain proper form with light weights. Current angle: ${kneeAngle.toFixed(2)} degrees.`;
    }
    return advice;
  };
  
  export const analyzeAnkleRehab = (ankleAngle) => {
    let advice = '';
    if (ankleAngle > 45) {
      advice = `Ankle rehab: Use lighter weights and avoid large ankle angles. Current angle: ${ankleAngle.toFixed(2)} degrees.`;
    } else {
      advice = `Ankle rehab: Maintain proper form with light weights. Current angle: ${ankleAngle.toFixed(2)} degrees.`;
    }
    return advice;
  };
  