import React from 'react';

// Common organic background blob
const Blob = ({ color }) => (
    <path fill={color} d="M54.5,-63.9C68.9,-53.4,77.7,-35.3,80.7,-16.9C83.7,1.5,80.9,20.2,71.7,35.4C62.5,50.6,46.9,62.3,29.3,68.9C11.7,75.5,-7.9,77,-24.5,71.1C-41.1,65.2,-54.6,51.9,-65.4,36.4C-76.2,20.9,-84.3,3.1,-80.7,-12.3C-77.1,-27.7,-61.8,-40.7,-46.3,-50.8C-30.8,-60.9,-15.4,-68.1,2.1,-70.6C19.6,-73.1,39.3,-71,54.5,-63.9Z" transform="translate(100 100) scale(1.1)" />
);

export const P2PListingIllustration = () => (
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
        <Blob color="#E6EDF2" />
        {/* House */}
        <path d="M100 35 L35 95 H60 V165 H140 V95 H165 Z" fill="#1363DF" />
        <path d="M100 35 L100 165 H140 V95 H165 Z" fill="#0A1A3F" opacity="0.2" />
        <path d="M115 165 V125 H85 V165" fill="#0A1A3F" />

        {/* Car overlap */}
        <g transform="translate(20, 10)">
            <path d="M40 120 H120 C130 120 130 140 120 140 H40 C30 140 30 120 40 120 Z" fill="#F8FAFC" stroke="#0A1A3F" strokeWidth="3" />
            <path d="M55 100 H105 L115 120 H45 Z" fill="#93C5FD" stroke="#0A1A3F" strokeWidth="3" />
            <circle cx="60" cy="140" r="10" fill="#0A1A3F" />
            <circle cx="100" cy="140" r="10" fill="#0A1A3F" />
        </g>
    </svg>
);

export const RealTimeSearchIllustration = () => (
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
        <Blob color="#E6EDF2" />
        {/* Folded Map */}
        <path d="M30 60 L80 40 L130 60 L170 40 V130 L120 150 L70 130 L30 150 Z" fill="#1363DF" opacity="0.9" />
        <path d="M80 40 V130 M130 60 V150" stroke="#0A1A3F" strokeWidth="3" fill="none" opacity="0.5" />
        <path d="M80 40 L130 60 V150 L80 130 Z" fill="#0A1A3F" opacity="0.15" />

        {/* Dashboard Pin */}
        <path d="M105 45 C85 45 70 60 70 80 C70 105 105 145 105 145 C105 145 140 105 140 80 C140 60 125 45 105 45 Z" fill="#EF4444" stroke="#FFFFFF" strokeWidth="3" />
        <circle cx="105" cy="75" r="10" fill="white" />

        {/* Magnifying Glass */}
        <g transform="translate(10, 20)">
            <circle cx="130" cy="120" r="18" fill="white" stroke="#0A1A3F" strokeWidth="6" />
            <line x1="142" y1="132" x2="162" y2="152" stroke="#0A1A3F" strokeWidth="8" strokeLinecap="round" />
            <circle cx="127" cy="117" r="6" fill="#93C5FD" opacity="0.5" />
        </g>
    </svg>
);

export const AutomatedReservationsIllustration = () => (
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
        <Blob color="#E6EDF2" />
        {/* Calendar Box */}
        <rect x="45" y="55" width="110" height="110" rx="12" fill="white" stroke="#0A1A3F" strokeWidth="4" />
        <rect x="45" y="55" width="110" height="35" rx="12" fill="#1363DF" stroke="#0A1A3F" strokeWidth="4" />

        {/* Binders */}
        <rect x="65" y="35" width="12" height="30" rx="6" fill="#EF4444" stroke="#0A1A3F" strokeWidth="3" />
        <rect x="125" y="35" width="12" height="30" rx="6" fill="#EF4444" stroke="#0A1A3F" strokeWidth="3" />

        {/* Grid lines inside calendar */}
        <path d="M70 115 H130 M70 135 H100" stroke="#CBD5E1" strokeWidth="4" strokeLinecap="round" />

        {/* Big Checkmark */}
        <path d="M75 120 L95 140 L135 90" fill="none" stroke="#10B981" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />

        {/* Float Clock */}
        <g transform="translate(10, 0)">
            <circle cx="150" cy="140" r="28" fill="#F59E0B" stroke="#0A1A3F" strokeWidth="4" />
            <circle cx="150" cy="140" r="20" fill="white" />
            <path d="M150 128 V140 L160 148" fill="none" stroke="#0A1A3F" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        </g>
    </svg>
);

export const SecurePaymentsIllustration = () => (
    <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-sm" xmlns="http://www.w3.org/2000/svg">
        <Blob color="#E6EDF2" />
        {/* Big Shield */}
        <path d="M100 30 L45 55 V95 C45 145 80 175 100 185 C120 175 155 145 155 95 V55 Z" fill="#1363DF" stroke="#0A1A3F" strokeWidth="3" />
        <path d="M100 30 L100 185 C120 175 155 145 155 95 V55 Z" fill="#0A1A3F" opacity="0.2" />

        <circle cx="100" cy="100" r="35" fill="white" />

        {/* Credit Card emerging from shield center */}
        <g transform="translate(10, -5) rotate(-12 100 110)">
            <rect x="55" y="90" width="80" height="52" rx="8" fill="#F8FAFC" stroke="#0A1A3F" strokeWidth="3" />
            <rect x="55" y="102" width="80" height="12" fill="#0A1A3F" />
            <rect x="65" y="125" width="22" height="6" rx="3" fill="#10B981" />
            <rect x="95" y="125" width="30" height="6" rx="3" fill="#CBD5E1" />
        </g>

        {/* Padlock Icon in top right */}
        <g transform="translate(140, 25)">
            <rect x="0" y="15" width="30" height="22" rx="4" fill="#F59E0B" stroke="#0A1A3F" strokeWidth="3" />
            <path d="M8 15 V10 C8 5 22 5 22 10 V15" fill="none" stroke="#0A1A3F" strokeWidth="3" />
            <circle cx="15" cy="26" r="3" fill="#0A1A3F" />
        </g>
    </svg>
);
