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

      {/* Middle hexagon */}
      <path
        d="M 50 10 L 75 25 L 75 55 L 50 70 L 25 55 L 25 25 Z"
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

      {/* Inner pulsing elements */}
      <g filter="url(#strong-glow)">
        {/* Center core */}
        <circle
          cx="50"
          cy="50"
          r="8"
          fill="url(#logo-gradient)"
        >
          <animate
            attributeName="r"
            values="8;12;8"
            dur="2s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="1;0.6;1"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Letter P stylized */}
        <path
          d="M 42 35 L 42 50 M 42 35 L 48 35 Q 52 35 52 39 Q 52 43 48 43 L 42 43"
          stroke="hsl(190, 100%, 50%)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <animate
            attributeName="opacity"
            values="0.6;1;0.6"
            dur="3s"
            repeatCount="indefinite"
          />
        </path>

        {/* Letter R stylized */}
        <path
          d="M 55 35 L 55 50 M 55 35 L 60 35 Q 63 35 63 39 Q 63 42 60 42 L 55 42 M 58 42 L 63 50"
          stroke="hsl(195, 100%, 45%)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        >
          <animate
            attributeName="opacity"
            values="0.6;1;0.6"
            dur="3s"
            begin="0.5s"
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