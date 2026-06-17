import React, { useMemo } from 'react';

/**
 * Main content component for the application.
 * Displays splash screen, main content, and results based on user interactions.
 */
const AppContent = ({
  showSplash, setShowSplash, bodyWeight, setBodyWeight, additionalWeight, setAdditionalWeight,
  weightUnit, setWeightUnit, isWebcamEnabled, setIsWebcamEnabled, loading, results, forceVecResults,
  analysisMet, shoulderAdvice, elbowAdvice, wristAdvice, lowerBackAdvice, hipAdvice, kneeAdvice,
  ankleAdvice, handleCheckboxChange, selectedInjuries, handleEnablePredictions, rehShoulderAdvice,
  rehElbowAdvice, rehWristAdvice, rehLowerBackAdvice, rehHipAdvice, rehKneeAdvice, rehAnkleAdvice,
  selectedRehabInjuries, repCount, repPeaks, desiredKneeAngle, setDesiredKneeAngle, desiredAnkleAngle,
  setDesiredAnkleAngle, squatAngles
}) => {
  // Filter repPeaks to show every other output
  const filteredRepPeaks = useMemo(() => repPeaks.filter((_, index) => index % 2 === 0), [repPeaks]);

  return (
    <div>
      {showSplash ? (
        <div className="splash-screen" onClick={() => setShowSplash(false)}>
          <div className="splash-content">
            <img src="exeter.jpg" alt="Exeter University Background" id="splash-uni"/>
            <img src="logomast.png" alt="Splash Background" className="splash-image" />
            <h2 className="splash-text">Tap to Continue</h2>
          </div>
        </div>
      ) : (
        <div className="wrapper">
          <header>
            <h1>Musculoskeletal Analysis Squat Tool</h1>
          </header>
          <section >
            <div className="button-group">
              {["Athletic performance", "Injury prevention", "Injury Rehabilitation"].map((label, index) => (
                <div key={index} className="dropdown">
                  <button id={`${label.replace(' ', '').toLowerCase()}Button`}
                    className="mdc-button mdc-button--raised dropdown-toggle">
                    <span className="mdc-button__label">{label}</span>
                  </button>
                  <div className="dropdown-content">
                    {label === "Athletic performance" && (
                      <>
                        <label>
                          <input type="radio" name="injOptions" value="lift" onChange={handleCheckboxChange} /> Max Lift
                        </label>
                        <label>
                          <input type="radio" name="injOptions" value="quad" onChange={handleCheckboxChange} /> Quadriceps Bias
                        </label>
                        <label>
                          <input type="radio" name="injOptions" value="post" onChange={handleCheckboxChange} /> Posterior chain Bias
                        </label>
                      </>
                    )}
                    {label === "Injury prevention" && (
                      <>
                        {["shoulders", "elbows", "wrists", "back", "hips", "knees", "ankles"].map(injury => (
                          <label key={injury}>
                            <input type="checkbox" name="injOptions" value={injury} onChange={handleCheckboxChange} /> 
                            {injury.charAt(0).toUpperCase() + injury.slice(1)}
                          </label>
                        ))}
                      </>
                    )}
                    {label === "Injury Rehabilitation" && (
                      <>
                        {["shoulders", "elbows", "wrists", "back", "hips", "knees", "ankles"].map(rehab => (
                          <label key={rehab}>
                            <input type="checkbox" name="rehOptions" value={rehab} onChange={handleCheckboxChange} /> 
                            {rehab.charAt(0).toUpperCase() + rehab.slice(1)}
                          </label>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
          <main id="demos" className="invisible">
            <button id="webcamButton" className="mdc-button mdc-button--raised"
              onClick={() => handleEnablePredictions(!isWebcamEnabled)}>
              <span className="mdc-button__ripple"></span>
              <span className="mdc-button__label">{isWebcamEnabled ? 'STOP' : 'ENABLE WEBCAM'}</span>
            </button>
            <div id="weights">
              {[
                { label: "Body Weight:", value: bodyWeight, setter: setBodyWeight },
                { label: "Additional Weight:", value: additionalWeight, setter: setAdditionalWeight },
                { label: "Unit:", value: weightUnit, setter: setWeightUnit, options: ["kg", "lbs"] }
              ].map(({ label, value, setter, options }, index) => (
                <label key={index} className="weightLabel">
                  {label}
                  {options ? (
                    <select value={value} onChange={(e) => setter(e.target.value)} className="inputs">
                      {options.map(option => <option key={option} value={option}>{option}</option>)}
                    </select>
                  ) : (
                    <input type="number" value={value} onChange={(e) => setter(e.target.value)} className="inputs"/>
                  )}
                </label>
              ))}
            </div>
            <div id="video">
              {!isWebcamEnabled && <img src="instructions.png" alt="Placeholder" style={{ width: '100%', maxWidth: '80em', height: 'auto', objectFit: 'cover' }} />}
              <video 
                id="webcam" 
                style={{
                  width: '100%',
                  maxWidth: '80em',
                  height: 'auto',
                  position: isWebcamEnabled ? 'absolute' : 'relative',
                  display: isWebcamEnabled ? 'block' : 'none',
                  top: 0,
                  left: 0
                }} 
                autoPlay 
                playsInline
                muted
              ></video>
              <canvas className="output_canvas" id="output_canvas"
                style={{ 
                  display: isWebcamEnabled && !loading ? 'block' : 'none',
                  width: '100%',
                  maxWidth: '80em',
                  height: 'auto',
                  transform: 'rotateY(180deg)'
                }}></canvas>
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
              <div className="analysisMet">
                <h3>Performance</h3>
                {selectedInjuries.includes("lift") && (
                  <div>
                    <label>
                      Desired Knee Angle:
                      <input type="number" value={desiredKneeAngle} onChange={(e) => setDesiredKneeAngle(e.target.value)} />
                    </label>
                    <label>
                      Desired Ankle Flexibility Angle:
                      <input type="number" value={desiredAnkleAngle} onChange={(e) => setDesiredAnkleAngle(e.target.value)} />
                    </label>
                    <p>Hip Angle: {squatAngles.hipAngle.toFixed(2)}</p>
                    <p>Back Angle: {squatAngles.backAngle.toFixed(2)}</p>
                  </div>
                )}
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
                    <p>This will result in less knee flexion and decrease these:</p>
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
                  <p key={index}>
                    Rep {peak.rep}: Knee Angle: {peak.kneeAngle.toFixed(2)}, Hip Angle: {peak.hipAngle.toFixed(2)},
                    Lower Back Angle: {peak.lowerBackAngle.toFixed(2)}
                  </p>
                ))}
              </div>
              <div className="forceVec">
                <h3>Loads at joints</h3>
                {forceVecResults.map((result, index) => (
                  <p key={index}>{result}</p>
                ))}
              </div>
            </div>
          </section>
          <footer>
            <p>&copy; 2024 Musculoskeletal Analysis Squat Tool. All rights reserved. For inquiries, contact me at:
              <a href="mailto:di236@exeter.ac.uk">di236@exeter.ac.uk</a>.
            </p>
          </footer>
        </div>
      )}
    </div>
  );
};

export default React.memo(AppContent);