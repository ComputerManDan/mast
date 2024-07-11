// calculateSquatAngles.js

import { calculateDistance } from './calculations'; // Ensure you import calculateDistance from the correct path

export const calculateSquatAngles = (landmarks, theta_k, theta_a) => {
  console.log("calculateSquatAngles called with:", { landmarks, theta_k, theta_a });

  if (!Array.isArray(landmarks)) {
    console.log("Landmarks is not an array or not provided");
    return { hipAngle: 0, backAngle: 0 };
  }

  if (landmarks.length < 33) {
    console.log("Not enough landmarks, found:", landmarks.length);
    return { hipAngle: 0, backAngle: 0 };
  }

  const hip = landmarks[23];
  const knee = landmarks[25];
  const ankle = landmarks[27];
  const shoulder = landmarks[11];

  console.log("Hip landmark:", hip);
  console.log("Knee landmark:", knee);
  console.log("Ankle landmark:", ankle);
  console.log("Shoulder landmark:", shoulder);

  if (!hip) {
    console.log("No hip landmark", hip);
    return { hipAngle: 0, backAngle: 0 };
  }

  if (!knee) {
    console.log("No knee landmark", knee);
    return { hipAngle: 0, backAngle: 0 };
  }

  if (!ankle) {
    console.log("No ankle landmark", ankle);
    return { hipAngle: 0, backAngle: 0 };
  }

  if (!shoulder) {
    console.log("No shoulder landmark", shoulder);
    return { hipAngle: 0, backAngle: 0 };
  }

  if (hip.x === undefined || hip.y === undefined || knee.x === undefined || knee.y === undefined || ankle.x === undefined || ankle.y === undefined || shoulder.x === undefined || shoulder.y === undefined) {
    console.log("Landmarks missing coordinates: ", { hip, knee, ankle, shoulder });
    return { hipAngle: 0, backAngle: 0 };
  }

  // Calculate the lengths of femur and tibia
  const femurLength = calculateDistance(hip, knee);
  const tibiaLength = calculateDistance(knee, ankle);

  const R_f = femurLength / tibiaLength;
  const torsoLength = calculateDistance(hip, shoulder);
  const R_t = torsoLength / tibiaLength;

  // Convert angles from degrees to radians for calculation
  let theta_k_rad = theta_k * (Math.PI / 180);
  let theta_a_rad = theta_a * (Math.PI / 180);

  // Calculate Hip Angle (θ_h)
  let cos_theta_h = (Math.cos(theta_k_rad) - R_f * Math.sin(theta_k_rad + theta_a_rad)) / Math.sqrt(1 + R_f ** 2);
  let theta_h = Math.acos(cos_theta_h);
  theta_h = theta_h * (180 / Math.PI); // Convert radians to degrees

  // Calculate Back Angle (θ_b)
  let theta_h_rad = theta_h * (Math.PI / 180); // Convert degrees to radians for sin function
  let theta_b = Math.atan((R_f * Math.sin(theta_h_rad)) / R_t);
  theta_b = theta_b * (180 / Math.PI); // Convert radians to degrees

  return {
    hipAngle: theta_h,
    backAngle: theta_b,
  };
};
