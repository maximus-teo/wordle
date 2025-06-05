const PopupSettings = ({ onReset, darkMode, highContrast, onClose }) => {

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
                <p>Keyboard Layout</p>
                <button >Button</button>
            </div>
            <div className="settings-item">
                <p>Hard Mode</p>
                <button >Button</button>
            </div>
            <div className="settings-item">
                <p>Confetti</p>
                <button >Button</button>
            </div>
        </div>
        <div className="settings-grid-danger">
            <div className="settings-item">
                <p>Resets all player data</p>
                <button className="dev-reset" onClick={onReset}>RESET ALL</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PopupSettings;