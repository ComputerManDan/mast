import React from 'react';

const FirstSection = () => {
  return (
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
            <label><input type="checkbox" name="rehOptions" value="hips" /> Hips</label>
            <label><input type="checkbox" name="rehOptions" value="knees" /> Knees</label>
            <label><input type="checkbox" name="rehOptions" value="ankles" /> Ankles</label>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FirstSection;
