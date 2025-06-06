export default function PopupConfirmReset({ confirmReset, onClose }) {
    return (
        <div className="popup">
            <div className="popup-confirm">
                <button className="popup-close" onClick={onClose}>&times;</button>
                <h2>Are you sure?</h2>
                <p>Click again to confirm if you would like to reset all your data, including total number of wins and max streaks.</p>
                <button onClick={ () => {
                    confirmReset();
                    onClose();
                }}>Reset</button>
            </div>
        </div>
    );
}