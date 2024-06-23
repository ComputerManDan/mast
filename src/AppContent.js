import React from 'react';

const AppContent = ({ showSplash, setShowSplash, bodyWeight, setBodyWeight, additionalWeight, setAdditionalWeight, weightUnit, setWeightUnit, isWebcamEnabled, setIsWebcamEnabled, loading, results, forceVecResults, analysisMet, shoulderAdvice, elbowAdvice, wristAdvice, lowerBackAdvice, hipAdvice}) => {
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
                    <label><input type="radio" name="injOptions" value="shoulders" /> Max Lift</label>
                    <label><input type="radio" name="injOptions" value="elbows" />Quadriceps Bias</label>
                    <label><input type="radio" name="injOptions" value="wrists" />Posterior chain Bias</label>
                </div>
                </div>
                <div className="dropdown">
                <button id="injButton" className="mdc-button mdc-button--raised dropdown-toggle">
                    <span className="mdc-button__label">Injury prevention</span>
                </button>
                <div className="dropdown-content">
                    <label><input type="checkbox" name="injOptions" value="shoulders" /> Shoulders</label>
                    <label><input type="checkbox" name="injOptions" value="elbows" /> Elbows</label>
                    <label><input type="checkbox" name="injOptions" value="wrists" /> Wrists</label>
                    <label><input type="checkbox" name="injOptions" value="back" /> Lower Back</label>
                    <label><input type="checkbox" name="injOptions" value="hips" /> Hips</label>
                    <label><input type="checkbox" name="injOptions" value="knees" /> Knees</label>
                    <label><input type="checkbox" name="injOptions" value="ankles" /> Ankles</label>
                </div>
                </div>
                <div className="dropdown">
                <button id="rehButton" className="mdc-button mdc-button--raised dropdown-toggle">
                    <span className="mdc-button__label">Injury Rehabilitation</span>
                </button>
                <div className="dropdown-content">
                    <label><input type="checkbox" name="rehOptions" value="shoulders" /> Shoulders</label>
                    <label><input type="checkbox" name="rehOptions" value="elbows" /> Elbows</label>
                    <label><input type="checkbox" name="rehOptions" value="wrists" /> Wrists</label>
                    <label><input type="checkbox" name="injOptions" value="back" /> Lower Back</label>
                    <label><input type="checkbox" name="rehOptions" value="hips" /> Hips</label>
                    <label><input type="checkbox" name="rehOptions" value="knees" /> Knees</label>
                    <label><input type="checkbox" name="rehOptions" value="ankles" /> Ankles</label>
                </div>
                </div>
            </div>
            </section>
          <main id="demos" className="invisible">
            <button id="webcamButton" className="mdc-button mdc-button--raised" onClick={() => setIsWebcamEnabled(true)}>
              <span className="mdc-button__ripple"></span>
              <span className="mdc-button__label">ENABLE WEBCAM</span>
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
                {results.map((result, index) => (
                  <p key={index}>{result}</p>
                ))}
              </div>
              <div className="forceVec">
                {forceVecResults.map((result, index) => (
                  <p key={index}>{result}</p>
                ))}
              </div>
              <div className="analysisMet">
                {analysisMet.map((result, index) => (
                  <p key={index}>{result}</p>
                ))}
              </div>
              <div className="analysisWords">
                <h3>Injury Prevention</h3>
                {shoulderAdvice && <p>{shoulderAdvice}</p>}
                {elbowAdvice && <p>{elbowAdvice}</p>}
                {wristAdvice && <p>{wristAdvice}</p>}
                {lowerBackAdvice && <p>{lowerBackAdvice}</p>}
                {hipAdvice && <p>{hipAdvice}</p>}
                <h3>Injury Rehabilitation</h3>
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
