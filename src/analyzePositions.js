// Analyze shoulder position based on combined wrist angle and forward lean.
const analyzeShoulderPosition = (combinedWristAngle, forwardLean) => {
    return combinedWristAngle > -0.1
        ? `Shoulder advice: Place the bar on the traps of the back. Combined wrist to shoulder: ${combinedWristAngle.toFixed(2)}m.`
        : `Shoulder advice: Move the bar up or lean further forward with the squat. Combined wrist to shoulder: ${combinedWristAngle.toFixed(2)}m. Leaning forward: ${forwardLean.toFixed(2)}m.`;
};

// Analyze elbow position based on distances between elbow, shoulder, and wrist.
const analyzeElbowPosition = (elbowToShoulderDistance, elbowToWristDistance) => {
    const ratio = elbowToWristDistance / elbowToShoulderDistance;
    return ratio < 1
        ? `Elbow advice: Your elbow position is good. Ratio: ${ratio.toFixed(2)} (Elbow to wrist distance: ${elbowToWristDistance.toFixed(2)}m, Elbow to shoulder distance: ${elbowToShoulderDistance.toFixed(2)}m).`
        : `Elbow advice: Your elbows are too far tucked forward. Ratio: ${ratio.toFixed(2)} (Elbow to wrist distance: ${elbowToWristDistance.toFixed(2)}m, Elbow to shoulder distance: ${elbowToShoulderDistance.toFixed(2)}m).`;
};

// Analyze wrist position based on left and right wrist angles.

const analyzeWristPosition = (leftWristAngle, rightWristAngle) => {
    const combinedWristAngle = Math.abs(Math.min(leftWristAngle, rightWristAngle) - 140);
    return combinedWristAngle === 0
        ? `Wrist advice: Your wrists are properly stacked over the elbows. Combined wrist angle: ${combinedWristAngle.toFixed(2)} degrees.`
        : `Wrist advice: Your wrists need to be stacked over the elbows. Combined wrist angle: ${combinedWristAngle.toFixed(2)} degrees.`;
};

// Analyze hip flexion based on hip angle, knee over toe angle, and lean angle.
const analyzeHipFlexion = (hipAngle, kneeOverToeAngle, leanAngle) => {
    return `Hip advice: To reduce hip pressure:
    \n- Move your feet closer together for increased knee over-toe translation.
    \n- Move the bar higher up on your back to reduce the amount of lean required.
    \nCurrent hip angle: ${hipAngle.toFixed(2)} degrees
    \nCurrent knee over-toe angle: ${kneeOverToeAngle.toFixed(2)} degrees
    \nCurrent lean angle: ${leanAngle.toFixed(2)} degrees`;
};

// Analyze lower back strain based on lean angle, foot width, and ankle angle.

const analyzeLowerBackStrain = (leanAngle, footWidth, ankleAngle) => {
    return `Lower back advice: To reduce strain:
    \n- Position your feet more forward for increased knee over-toe translation.
    \n- Move the bar up higher on your back to reduce the lean required to keep the bar over the center line of the lift.
    \nCurrent lean: ${leanAngle.toFixed(2)} degrees
    \nFoot width: ${footWidth.toFixed(2)} meters
    \nKnee over-toe transition (ankle angle): ${ankleAngle.toFixed(2)} degrees`;
};


// Analyze knee position based on knee angle.
const analyzeKneePosition = (kneeAngle) => {
    return kneeAngle > 90
        ? `To reduce pressure on your ankle load more into the hips (to reduce knee over toe translation), Knee advice: Your knee angle is appropriate. Current angle: ${kneeAngle.toFixed(2)} degrees.`
        : `To reduce pressure on knee load more into the hips (to reduce knee over toe translation), Knee advice: Your knee angle is too large, high pressure. Current angle: ${kneeAngle.toFixed(2)} degrees.`;
};

// Analyze ankle position based on ankle angle.
const analyzeAnklePosition = (ankleAngle) => {
    return ankleAngle > 45
        ? `To reduce pressure on your ankle load more into the hips (to reduce knee over toe translation), Ankle advice: Your ankle angle is appropriate. Current angle: ${ankleAngle.toFixed(2)} degrees.`
        : `To reduce pressure on your ankle load more into the hips (to reduce knee over toe translation), Ankle advice: Your ankle angle is too large leading to high pressure. Current angle: ${ankleAngle.toFixed(2)} degrees.`;
};

module.exports = {
    analyzeShoulderPosition,
    analyzeElbowPosition,
    analyzeWristPosition,
    analyzeHipFlexion,
    analyzeLowerBackStrain,
    analyzeKneePosition,
    analyzeAnklePosition
};
