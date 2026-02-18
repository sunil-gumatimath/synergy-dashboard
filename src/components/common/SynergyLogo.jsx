import React from "react";
import PropTypes from "prop-types";

/**
 * Synergy Logo - Custom SVG logo representing synergy and collaboration
 * Features flowing wave lines in purple and blue gradient
 */
const SynergyLogo = ({ size = 32, className = "" }) => {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            aria-label="Synergy Logo"
        >
            <defs>
                {/* Gradient for synergy waves */}
                <linearGradient id="synergyGradient1" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#a78bfa" />
                    <stop offset="50%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
                <linearGradient id="synergyGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#c4b5fd" />
                    <stop offset="50%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
                <linearGradient id="synergyGradient3" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="50%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#6d28d9" />
                </linearGradient>
                {/* Glow filter */}
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Synergy wave 1 - top */}
            <path
                d="M8 20 Q16 12, 26 18 T44 14 T58 22"
                stroke="url(#synergyGradient1)"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                filter="url(#glow)"
                opacity="0.9"
            />

            {/* Synergy wave 2 - middle */}
            <path
                d="M6 32 Q18 24, 32 32 T52 28 T60 36"
                stroke="url(#synergyGradient2)"
                strokeWidth="5"
                strokeLinecap="round"
                fill="none"
                filter="url(#glow)"
            />

            {/* Synergy wave 3 - bottom */}
            <path
                d="M10 44 Q22 38, 36 46 T56 42"
                stroke="url(#synergyGradient3)"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                filter="url(#glow)"
                opacity="0.85"
            />

            {/* Small accent dot - star */}
            <circle
                cx="52"
                cy="16"
                r="2"
                fill="#c4b5fd"
                filter="url(#glow)"
            />
        </svg>
    );
};

SynergyLogo.propTypes = {
    size: PropTypes.number,
    className: PropTypes.string,
};

export default SynergyLogo;
