import { calculateDistance } from './calculations';

// Calculate squat angles based on landmarks and desired angles.
export const calculateSquatAngles = (landmarks, theta_k, theta_a) => {
  if (!Array.isArray(landmarks) || landmarks.length < 33) {
    return { hipAngle: 0, backAngle: 0 };
  }

  const hip = landmarks[23];
  const knee = landmarks[25];
  const ankle = landmarks[27];
  const shoulder = landmarks[11];

  if (!hip || !knee || !ankle || !shoulder) {
    return { hipAngle: 0, backAngle: 0 };
  }

  if ([hip, knee, ankle, shoulder].some(point => point.x === undefined || point.y === undefined)) {
    return { hipAngle: 0, backAngle: 0 };
  }

  // Calculate the lengths of femur and tibia
  const femurLength = calculateDistance(hip, knee);
  const tibiaLength = calculateDistance(knee, ankle);
  const torsoLength = calculateDistance(hip, shoulder);

  const R_f = femurLength / tibiaLength;
  const R_t = torsoLength / tibiaLength;

  // Convert angles from degrees to radians for calculation
  const theta_k_rad = theta_k * (Math.PI / 180);
  const theta_a_rad = theta_a * (Math.PI / 180);

  // Calculate Hip Angle (θ_h)
  const cos_theta_h = (Math.cos(theta_k_rad) - R_f * Math.sin(theta_k_rad + theta_a_rad)) / Math.sqrt(1 + R_f ** 2);
  let theta_h = Math.acos(cos_theta_h);
  theta_h = theta_h * (180 / Math.PI); // Convert radians to degrees

  // Calculate Back Angle (θ_b)
  const theta_h_rad = theta_h * (Math.PI / 180); // Convert degrees to radians for sin function
  let theta_b = Math.atan((R_f * Math.sin(theta_h_rad)) / R_t);
  theta_b = theta_b * (180 / Math.PI); // Convert radians to degrees

  return {
    hipAngle: theta_h,
    backAngle: theta_b,
  };
};