// analyzePositions.js

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
    let advice = '';
    if (kneeAngle > 90) {
        advice = `To reduce pressure on your ankle load more in to the hips (to reduce knee over toe translation), Knee advice: Your knee angle is appropriate. Current angle: ${kneeAngle.toFixed(2)} degrees.`;
    } else {
        advice = `To reduce pressure on knee load more in to the hips (to reduce knee over toe translation), Knee advice: Your knee angle is too large, high pressure. Current angle: ${kneeAngle.toFixed(2)} degrees.`;
    }
    return advice;
};

const analyzeAnklePosition = (ankleAngle) => {
    let advice = '';
    if (ankleAngle > 45) {
        advice = `To reduce pressure on your ankle load more in to the hips (to reduce knee over toe translation), Ankle advice: Your ankle angle is appropriate. Current angle: ${ankleAngle.toFixed(2)} degrees.`;
    } else {
        advice = `To reduce pressure on your ankle load more in to the hips (to reduce knee over toe translation), Ankle advice: Your ankle angle is too large leading to high pressure. Current angle: ${ankleAngle.toFixed(2)} degrees.`;
    }
    return advice;
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
