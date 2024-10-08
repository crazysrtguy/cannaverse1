import React from 'react';
import './HUD.css';

const Hud = ({ speed, altitude, gpsLocation }) => {
    return (
        <div className="hud-container">
            <div className="hud-item">
                <div className="hud-label">Speed</div>
                <div className="hud-value">{speed} m/s</div>
            </div>
            <div className="hud-item">
                <div className="hud-label">Altitude</div>
                <div className="hud-value">{altitude} m</div>
            </div>
            <div className="hud-item">
                <div className="hud-label">GPS Location</div>
                <div className="hud-value">{gpsLocation}</div>
            </div>
        </div>
    );
};

export default Hud;
