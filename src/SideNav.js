import React, { useState } from 'react';
import './SideNav.css';

const SideNav = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleNav = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <button onClick={toggleNav} className="toggle-button">☰</button>
            <div className={`side-nav ${isOpen ? 'open' : ''}`}>
            <a href="/">Home</a>
            <a href="/planet-constructor">Create Planet</a>
            <a href="/procedural-universe">Procedural Universe</a>
            <a href="/lensflares-scene">FLY</a>
            <a href="/road-map">Road Map</a>
            <a href="/blaster">Space Blaster</a>
            <a href="/space-race">Smoke and Chill</a>
            <a href="/globe">Explore</a>
            <a href="https://canna-verse-game--ten.vercel.app/">Games</a>
            <a href="https://cannabook.vercel.app/">ART TG Portal</a>

            <a href="/my-planets">My Universe</a>
            </div>
        </>
    );
}

export default SideNav;
