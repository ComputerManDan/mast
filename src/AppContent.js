// AppContent.js

import React from 'react';

const AppContent = ({
  showSplash, setShowSplash, bodyWeight, setBodyWeight, additionalWeight, setAdditionalWeight,
  weightUnit, setWeightUnit, isWebcamEnabled, setIsWebcamEnabled, loading, results, forceVecResults,
  analysisMet, shoulderAdvice, elbowAdvice, wristAdvice, lowerBackAdvice, hipAdvice, kneeAdvice,
  ankleAdvice, handleCheckboxChange, selectedInjuries, handleEnablePredictions, rehShoulderAdvice,
  rehElbowAdvice, rehWristAdvice, rehLowerBackAdvice, rehHipAdvice, rehKneeAdvice, rehAnkleAdvice,
  selectedRehabInjuries, repCount, repPeaks, desiredKneeAngle, setDesiredKneeAngle, desiredAnkleAngle, setDesiredAnkleAngle, calculateSquatAngles
}) => {
  // Filter repPeaks to show every other output
  const filteredRepPeaks = repPeaks.filter((_, index) => index % 2 === 0);

  return (
    <div>
      {showSplash && (
        <div className="splash-screen" onClick={() => setShowSplash(false)}>
          <div className="splash-content">
            <img src="exeter.jpg" alt="Exeter University Background" id="splash-uni"/>
            <img src="logomast.png" alt="Splash Background" className="splash-image" />
            <h2 className="splash-text">Tap to Continue</h2>
          </div>
        </div>
      )}
      {!showSplash && (
        <div className="wrapper">
          <header>
            <h1>Musculoskeletal Analysis Squat Tool</h1>
          </header>
          <section>
            <div className="button-group">
              <div className="dropdown">
                <button id="athButton" className="mdc-button mdc-button--raised dropdown-toggle">
                  <span className="mdc-button__label">Athletic performance</span>
                </button>
                <div className="dropdown-content">
                  <label><input type="radio" name="injOptions" value="lift" onChange={handleCheckboxChange} /> Max Lift</label>
                  <label><input type="radio" name="injOptions" value="quad" onChange={handleCheckboxChange} /> Quadriceps Bias</label>
                  <label><input type="radio" name="injOptions" value="post" onChange={handleCheckboxChange} /> Posterior chain Bias</label>
                </div>
              </div>
              <div className="dropdown">
                <button id="injButton" className="mdc-button mdc-button--raised dropdown-toggle">
                  <span className="mdc-button__label">Injury prevention</span>
                </button>
                <div className="dropdown-content">
                  <label><input type="checkbox" name="injOptions" value="shoulders" onChange={handleCheckboxChange} /> Shoulders</label>
                  <label><input type="checkbox" name="injOptions" value="elbows" onChange={handleCheckboxChange} /> Elbows</label>
                  <label><input type="checkbox" name="injOptions" value="wrists" onChange={handleCheckboxChange} /> Wrists</label>
                  <label><input type="checkbox" name="injOptions" value="back" onChange={handleCheckboxChange} /> Lower Back</label>
                  <label><input type="checkbox" name="injOptions" value="hips" onChange={handleCheckboxChange} /> Hips</label>
                  <label><input type="checkbox" name="injOptions" value="knees" onChange={handleCheckboxChange} /> Knees</label>
                  <label><input type="checkbox" name="injOptions" value="ankles" onChange={handleCheckboxChange} /> Ankles</label>
                </div>
              </div>
              <div className="dropdown">
                <button id="rehButton" className="mdc-button mdc-button--raised dropdown-toggle">
                  <span className="mdc-button__label">Injury Rehabilitation</span>
                </button>
                <div className="dropdown-content">
                  <label><input type="checkbox" name="rehOptions" value="shoulders" onChange={handleCheckboxChange} /> Shoulders</label>
                  <label><input type="checkbox" name="rehOptions" value="elbows" onChange={handleCheckboxChange} /> Elbows</label>
                  <label><input type="checkbox" name="rehOptions" value="wrists" onChange={handleCheckboxChange} /> Wrists</label>
                  <label><input type="checkbox" name="rehOptions" value="back" onChange={handleCheckboxChange} /> Lower Back</label>
                  <label><input type="checkbox" name="rehOptions" value="hips" onChange={handleCheckboxChange} /> Hips</label>
                  <label><input type="checkbox" name="rehOptions" value="knees" onChange={handleCheckboxChange} /> Knees</label>
                  <label><input type="checkbox" name="rehOptions" value="ankles" onChange={handleCheckboxChange} /> Ankles</label>
                </div>
              </div>
            </div>
          </section>
          <main id="demos" className="invisible">
            <button id="webcamButton" className="mdc-button mdc-button--raised" onClick={() => handleEnablePredictions(!isWebcamEnabled)}>
              <span className="mdc-button__ripple"></span>
              <span className="mdc-button__label">{isWebcamEnabled ? 'STOP' : 'ENABLE WEBCAM'}</span>
            </button>
            <div id="weights">
              <label className="weightLabel">
                Body Weight:
                <input type="number" value={bodyWeight} onChange={(e) => setBodyWeight(e.target.value)} className="inputs"/>
              </label>
              <label className="weightLabel">
                Additional Weight:
                <input type="number" value={additionalWeight} onChange={(e) => setAdditionalWeight(e.target.value)} className="inputs"/>
              </label>
              <label className="weightLabel">
                Unit:
                <select value={weightUnit} onChange={(e) => setWeightUnit(e.target.value)} className="inputs">
                  <option value="kg">Kg</option>
                  <option value="lbs">Lbs</option>
                </select>
              </label>
            </div>
            <div id="video">
              {!isWebcamEnabled && <img src="logomast.png" alt="Placeholder" style={{ width: '1280px', height: '720px' }} />}
              <video id="webcam" style={{ width: '1280px', height: '720px', position: isWebcamEnabled ? 'absolute' : 'relative', display: isWebcamEnabled ? 'block' : 'none' }} autoPlay playsInline></video>
              <canvas className="output_canvas" id="output_canvas" width="1280" height="720" style={{ display: isWebcamEnabled && !loading ? 'block' : 'none' }}></canvas>
              {loading && (
                <div className="loading-background">
                  <div className="loading-overlay">
                    <p>Loading</p>
                  </div>
                </div>
              )}
            </div>
          </main>
          <section>
            <h2>Results</h2>
            <div className="results">
              <div className="angles">
                <h3>Angles</h3>
                {results.map((result, index) => (
                  <p key={index}>{result}</p>
                ))}
              </div>
              <div className="peaks">
                <h3>Peaks & Reps</h3>
                <p>Reps: {repCount}</p>
                {filteredRepPeaks.map((peak, index) => (
                  <p key={index}>Rep {peak.rep}: Knee Angle: {peak.kneeAngle.toFixed(2)}, Hip Angle: {peak.hipAngle.toFixed(2)}, Lower Back Angle: {peak.lowerBackAngle.toFixed(2)}</p>
                ))}
              </div>
              <div className="forceVec">
                <h3>Loads at joints</h3>
                {forceVecResults.map((result, index) => (
                  <p key={index}>{result}</p>
                ))}
              </div>
            </div>
            <div className="results">
              <div className="analysisMet">
                <h3>Performance</h3>
                {selectedInjuries.includes("quad") && (
                  <>
                    <p>To increase these have more knee flexion:</p>
                    {analysisMet.filter(result =>
                      result.includes("Quadriceps Force") || result.includes("Knee Torque")
                    ).map((result, index) => (
                      <p key={index}>{result}</p>
                    ))}
                    <p>This should result in a decrease of hip flexion and likely less forward lean:</p>
                    {analysisMet.filter(result =>
                      result.includes("Hamstrings Force") || result.includes("Gluteus Maximus Force") || result.includes("Hip Torque")
                    ).map((result, index) => (
                      <p key={index}>{result}</p>
                    ))}
                  </>
                )}

                {selectedInjuries.includes("post") && (
                  <>
                    <p>To increase these have more hip flexion and forward lean to compensate if needed:</p>
                    {analysisMet.filter(result =>
                      result.includes("Hamstrings Force") || result.includes("Gluteus Maximus Force") || result.includes("Hip Torque")
                    ).map((result, index) => (
                      <p key={index}>{result}</p>
                    ))}
                    <p> This will result in less knee flexion and decrease these:</p>
                    {analysisMet.filter(result =>
                      result.includes("Quadriceps Force") || result.includes("Knee Torque")
                    ).map((result, index) => (
                      <p key={index}>{result}</p>
                    ))}
                  </>
                )}
              </div>

              <div className="InjPrev">
                <h3>Injury Prevention</h3>
                {selectedInjuries.includes("shoulders") && shoulderAdvice && <p>{shoulderAdvice}</p>}
                {selectedInjuries.includes("elbows") && elbowAdvice && <p>{elbowAdvice}</p>}
                {selectedInjuries.includes("wrists") && wristAdvice && <p>{wristAdvice}</p>}
                {selectedInjuries.includes("back") && lowerBackAdvice && <p>{lowerBackAdvice}</p>}
                {selectedInjuries.includes("hips") && hipAdvice && <p>{hipAdvice}</p>}
                {selectedInjuries.includes("knees") && kneeAdvice && <p>{kneeAdvice}</p>}
                {selectedInjuries.includes("ankles") && ankleAdvice && <p>{ankleAdvice}</p>}
              </div>
              <div className="InjReh">
                <h3>Injury Rehabilitation</h3>
                {selectedRehabInjuries.includes("shoulders") && rehShoulderAdvice && <p>{rehShoulderAdvice}</p>}
                {selectedRehabInjuries.includes("elbows") && rehElbowAdvice && <p>{rehElbowAdvice}</p>}
                {selectedRehabInjuries.includes("wrists") && rehWristAdvice && <p>{rehWristAdvice}</p>}
                {selectedRehabInjuries.includes("back") && rehLowerBackAdvice && <p>{rehLowerBackAdvice}</p>}
                {selectedRehabInjuries.includes("hips") && rehHipAdvice && <p>{rehHipAdvice}</p>}
                {selectedRehabInjuries.includes("knees") && rehKneeAdvice && <p>{rehKneeAdvice}</p>}
                {selectedRehabInjuries.includes("ankles") && rehAnkleAdvice && <p>{rehAnkleAdvice}</p>}
              </div>
            </div>
          </section>
          <footer>
            <p>&copy; 2024 Musculoskeletal Analysis Squat Tool. All rights reserved. For inquiries, contact us at <a href="mailto:di236@exeter.ac.uk">di236@exeter.ac.uk</a>.</p>
          </footer>
        </div>
      )}
    </div>
  );
};

export default AppContent;