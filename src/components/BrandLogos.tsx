import React from "react";

export const EstovirLogo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Estovir Technologies Logo"
  >
    {/* Stylized Modern "E" Tech Monogram exactly as shown in screenshot */}
    <rect x="22" y="20" width="22" height="60" rx="3" fill="#141413" />
    <rect x="44" y="20" width="34" height="16" rx="3" fill="#141413" />
    <rect x="44" y="42" width="30" height="16" rx="3" fill="#C8E93D" />
    <rect x="44" y="64" width="34" height="16" rx="3" fill="#C8E93D" />
  </svg>
);

export const ReachcureLogo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Reachcure Healthcare Logo"
  >
    {/* Stylized "R" with healthcare pulse accent */}
    <path
      d="M24 20H54C65.5 20 74 28.5 74 40C74 49.5 67 57.5 58 59.5L76 80H58L42 62H38V80H24V20ZM38 32V50H52C58 50 61 46 61 40C61 34 58 32 52 32H38Z"
      fill="#141413"
    />
    <rect x="64" y="22" width="6" height="16" rx="3" fill="#C8E93D" />
    <rect x="59" y="27" width="16" height="6" rx="3" fill="#C8E93D" />
  </svg>
);

export const VmdLogo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="VMD CAD Technologies Logo"
  >
    <circle cx="50" cy="50" r="38" stroke="#141413" strokeWidth="3" strokeDasharray="4 3" />
    <path d="M50 12V88M12 50H88" stroke="#C8E93D" strokeWidth="2.5" />
    <text
      x="50"
      y="58"
      textAnchor="middle"
      fill="#141413"
      fontFamily="Space Grotesk, sans-serif"
      fontWeight="900"
      fontSize="22"
      letterSpacing="-0.5"
    >
      VMD
    </text>
  </svg>
);

export const DpgCollegeLogo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="DPG Degree College Logo"
  >
    {/* Official DPG Degree College Crest Motif */}
    <circle cx="50" cy="50" r="42" fill="#1E3A8A" />
    <circle cx="50" cy="50" r="39" fill="#FFFFFF" stroke="#D97706" strokeWidth="2" />
    <circle cx="50" cy="50" r="32" fill="#1E3A8A" />
    {/* Heraldic Shield in Gold */}
    <path
      d="M34 32H66V50C66 60 50 67 50 67C50 67 34 60 34 50V32Z"
      fill="#F59E0B"
      stroke="#FFFFFF"
      strokeWidth="1.5"
    />
    {/* Open Book of Learning */}
    <path
      d="M40 40C43 38 47 39 50 41C53 39 57 38 60 40V52C57 50 53 51 50 53C47 51 43 50 40 52V40Z"
      fill="#FFFFFF"
    />
    <line x1="50" y1="41" x2="50" y2="53" stroke="#1E3A8A" strokeWidth="1" />
    {/* Laurel Dots */}
    <circle cx="26" cy="50" r="2.5" fill="#F59E0B" />
    <circle cx="74" cy="50" r="2.5" fill="#F59E0B" />
    <circle cx="50" cy="18" r="2.5" fill="#F59E0B" />
    <circle cx="50" cy="82" r="2.5" fill="#F59E0B" />
  </svg>
);

export const HbseBoardLogo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="HBSE Education Board Logo"
  >
    <circle cx="50" cy="50" r="40" fill="#F8FAFC" stroke="#141413" strokeWidth="2.5" />
    <circle cx="50" cy="50" r="32" stroke="#C8E93D" strokeWidth="2.5" strokeDasharray="3 2" />
    <path d="M43 62L50 46L57 62H43Z" fill="#141413" />
    <circle cx="50" cy="42" r="5" fill="#C8E93D" />
    <path
      d="M32 68C38 66 44 67 50 69C56 67 62 66 68 68"
      stroke="#141413"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

export const SecondaryBoardLogo: React.FC<{ className?: string }> = ({ className = "w-12 h-12" }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Secondary Board Logo"
  >
    <circle cx="50" cy="50" r="40" fill="#FFFFFF" stroke="#141413" strokeWidth="2.5" />
    <circle cx="50" cy="50" r="30" fill="#141413" />
    <path
      d="M38 45C42 43 47 44 50 46C53 44 58 43 62 45V58C58 56 53 57 50 59C47 57 42 56 38 58V45Z"
      fill="#C8E93D"
    />
    <line x1="50" y1="46" x2="50" y2="59" stroke="#141413" strokeWidth="1.5" />
  </svg>
);
