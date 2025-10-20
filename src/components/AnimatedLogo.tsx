export const AnimatedLogo = ({ className = "", size = 48 }: { className?: string; size?: number }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="logo-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(195, 100%, 45%)" />
          <stop offset="50%" stopColor="hsl(190, 100%, 50%)" />
          <stop offset="100%" stopColor="hsl(199, 89%, 48%)" />
        </linearGradient>
        
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        <filter id="strong-glow">
          <feGaussianBlur stdDeviation="5" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Outer rotating ring */}
      <circle
        cx="50"
        cy="50"
        r="45"
        stroke="url(#logo-gradient)"
        strokeWidth="2"
        fill="none"
        opacity="0.3"
        filter="url(#glow)"
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 50 50"
          to="360 50 50"
          dur="20s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.3;0.6;0.3"
          dur="3s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Middle hexagon - bigger and centered */}
      <path
        d="M 50 5 L 82 27.5 L 82 72.5 L 50 95 L 18 72.5 L 18 27.5 Z"
        stroke="url(#logo-gradient)"
        strokeWidth="2.5"
        fill="none"
        filter="url(#glow)"
      >
        <animate
          attributeName="stroke-width"
          values="2.5;3.5;2.5"
          dur="2s"
          repeatCount="indefinite"
        />
      </path>

      {/* Center pulsing "PR" letters */}
      <g filter="url(#strong-glow)">
        {/* Letter P */}
        <path
          d="M 38 40 L 38 60 M 38 40 L 46 40 Q 51 40 51 45 Q 51 50 46 50 L 38 50"
          stroke="hsl(190, 100%, 50%)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <animate
            attributeName="opacity"
            values="0.7;1;0.7"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-width"
            values="3;4;3"
            dur="2s"
            repeatCount="indefinite"
          />
        </path>

        {/* Letter R */}
        <path
          d="M 54 40 L 54 60 M 54 40 L 62 40 Q 66 40 66 45 Q 66 49 62 49 L 54 49 M 59 49 L 66 60"
          stroke="hsl(195, 100%, 45%)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <animate
            attributeName="opacity"
            values="0.7;1;0.7"
            dur="2s"
            begin="0.3s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="stroke-width"
            values="3;4;3"
            dur="2s"
            begin="0.3s"
            repeatCount="indefinite"
          />
        </path>
      </g>

      {/* Corner accent dots */}
      <g opacity="0.8">
        <circle cx="50" cy="15" r="2" fill="hsl(190, 100%, 50%)">
          <animate
            attributeName="opacity"
            values="0.3;1;0.3"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="72" cy="28" r="2" fill="hsl(195, 100%, 45%)">
          <animate
            attributeName="opacity"
            values="0.3;1;0.3"
            dur="1.5s"
            begin="0.3s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="72" cy="52" r="2" fill="hsl(199, 89%, 48%)">
          <animate
            attributeName="opacity"
            values="0.3;1;0.3"
            dur="1.5s"
            begin="0.6s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="50" cy="65" r="2" fill="hsl(190, 100%, 50%)">
          <animate
            attributeName="opacity"
            values="0.3;1;0.3"
            dur="1.5s"
            begin="0.9s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="28" cy="52" r="2" fill="hsl(195, 100%, 45%)">
          <animate
            attributeName="opacity"
            values="0.3;1;0.3"
            dur="1.5s"
            begin="1.2s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="28" cy="28" r="2" fill="hsl(199, 89%, 48%)">
          <animate
            attributeName="opacity"
            values="0.3;1;0.3"
            dur="1.5s"
            begin="1.5s"
            repeatCount="indefinite"
          />
        </circle>
      </g>

      {/* Scanning line effect */}
      <line
        x1="25"
        y1="50"
        x2="75"
        y2="50"
        stroke="hsl(190, 100%, 50%)"
        strokeWidth="1"
        opacity="0.5"
      >
        <animate
          attributeName="y1"
          values="25;75;25"
          dur="4s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="y2"
          values="25;75;25"
          dur="4s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0;0.5;0"
          dur="4s"
          repeatCount="indefinite"
        />
      </line>
    </svg>
  );
};