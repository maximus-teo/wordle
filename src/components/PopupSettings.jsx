import {useState} from 'react';
import PopupConfirmReset from './PopupConfirmReset';

const PopupSettings = ({ onReset, darkMode, highContrast, layouts, keyboardLayout, setKeyboardLayout, confetti, showConfetti, onClose }) => {

  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const updateConfetti = () => {
    console.log("confetti in local storage", localStorage.getItem("showConfetti"));
    console.log("confetti set", confetti);
    showConfetti();
    console.log("confetti in LS after", localStorage.getItem("showConfetti"));
    console.log("confetti set after", confetti);
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <button className="popup-close" onClick={onClose}>
          &times;
        </button>
        <h2>Settings</h2>

        <div className="settings-grid-container">
            <div className="settings-item">
                <p>Change Theme (Light/Dark)</p>
                <button onClick={darkMode}>Toggle</button>
            </div>
            <div className="settings-item">
                <p>High Contrast Mode</p>
                <button onClick={highContrast}>Toggle</button>
            </div>
            <div className="settings-item">
              <label htmlFor="keyboard-select">Keyboard Layout:</label>
              <select
                className="custom-select"
                id="keyboard-select"
                value={keyboardLayout}
                onChange={(e) => setKeyboardLayout(e.target.value)}
              >
                {Object.keys(layouts).map(layout => (
                  <option key={layout} value={layout}>{layout}</option>
                ))}
              </select>
            </div>
            <div className="settings-item">
                <p>Confetti effects</p>
                <label className="custom-checkbox">
                  <input
                    type="checkbox"
                    checked={confetti}
                    onChange={updateConfetti}
                  />
                  <span className="checkmark"></span>
                  {confetti ? 'On' : 'Off'}
                </label>
            </div>
        </div>
        <div className="settings-grid-danger">
            <div className="settings-item">
                <p>Hard Mode</p>
                <label className="custom-checkbox">
                  <input
                    type="checkbox"
                  />
                  <span className="checkmark"></span>
                  On/Off
                </label>
            </div>
            <div className="settings-item">
                <p>Reset all player data</p>
                <button onClick={()=> setShowConfirmReset(true)}>RESET</button>
            </div>
        </div>
      </div>
      {showConfirmReset &&
        <PopupConfirmReset
          confirmReset={onReset}
          onClose={() => setShowConfirmReset(false)}/>}
    </div>
  );
};

export default PopupSettings;