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
        {/* Gradients */}
        <linearGradient id="orbit-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(225, 100%, 64%)" />
          <stop offset="100%" stopColor="hsl(270, 100%, 62%)" />
        </linearGradient>
        
        <radialGradient id="core-gradient">
          <stop offset="0%" stopColor="hsl(225, 100%, 64%)" />
          <stop offset="100%" stopColor="hsl(270, 100%, 62%)" />
        </radialGradient>

        <radialGradient id="halo-gradient">
          <stop offset="0%" stopColor="hsl(245, 100%, 63%)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="hsl(245, 100%, 63%)" stopOpacity="0" />
        </radialGradient>

        {/* Filters */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>

        <filter id="strong-glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Pulsating halo background */}
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="url(#halo-gradient)"
      >
        <animate
          attributeName="r"
          values="35;45;35"
          dur="4s"
          repeatCount="indefinite"
        />
        <animate
          attributeName="opacity"
          values="0.4;0;0.4"
          dur="4s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Orbit 1 - Horizontal ellipse, rotating clockwise */}
      <g>
        <ellipse
          cx="50"
          cy="50"
          rx="35"
          ry="12"
          stroke="url(#orbit-gradient)"
          strokeWidth="6"
          fill="none"
          filter="url(#glow)"
          opacity="0.8"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 50 50"
            to="360 50 50"
            dur="10s"
            repeatCount="indefinite"
          />
        </ellipse>
        {/* Particles on orbit 1 */}
        <circle cx="85" cy="50" r="2.5" fill="hsl(225, 100%, 70%)">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 50 50"
            to="360 50 50"
            dur="10s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.5;1;0.5"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="15" cy="50" r="2.5" fill="hsl(270, 100%, 70%)">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="180 50 50"
            to="540 50 50"
            dur="10s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.5;1;0.5"
            dur="1.5s"
            begin="0.5s"
            repeatCount="indefinite"
          />
        </circle>
      </g>

      {/* Orbit 2 - Tilted 120 degrees, rotating counter-clockwise */}
      <g>
        <ellipse
          cx="50"
          cy="50"
          rx="35"
          ry="12"
          stroke="url(#orbit-gradient)"
          strokeWidth="6"
          fill="none"
          filter="url(#glow)"
          opacity="0.8"
          transform="rotate(120 50 50)"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="120 50 50"
            to="-240 50 50"
            dur="14s"
            repeatCount="indefinite"
            additive="sum"
          />
        </ellipse>
        {/* Particles on orbit 2 */}
        <circle cx="85" cy="50" r="2.5" fill="hsl(245, 100%, 70%)" transform="rotate(120 50 50)">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="120 50 50"
            to="-240 50 50"
            dur="14s"
            repeatCount="indefinite"
            additive="sum"
          />
          <animate
            attributeName="opacity"
            values="0.5;1;0.5"
            dur="1.5s"
            begin="0.3s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="15" cy="50" r="2.5" fill="hsl(225, 100%, 65%)" transform="rotate(120 50 50)">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="300 50 50"
            to="-60 50 50"
            dur="14s"
            repeatCount="indefinite"
            additive="sum"
          />
          <animate
            attributeName="opacity"
            values="0.5;1;0.5"
            dur="1.5s"
            begin="0.8s"
            repeatCount="indefinite"
          />
        </circle>
      </g>

      {/* Orbit 3 - Tilted 240 degrees, rotating clockwise */}
      <g>
        <ellipse
          cx="50"
          cy="50"
          rx="35"
          ry="12"
          stroke="url(#orbit-gradient)"
          strokeWidth="6"
          fill="none"
          filter="url(#glow)"
          opacity="0.8"
          transform="rotate(240 50 50)"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="240 50 50"
            to="600 50 50"
            dur="18s"
            repeatCount="indefinite"
            additive="sum"
          />
        </ellipse>
        {/* Particles on orbit 3 */}
        <circle cx="85" cy="50" r="2.5" fill="hsl(270, 100%, 65%)" transform="rotate(240 50 50)">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="240 50 50"
            to="600 50 50"
            dur="18s"
            repeatCount="indefinite"
            additive="sum"
          />
          <animate
            attributeName="opacity"
            values="0.5;1;0.5"
            dur="1.5s"
            begin="0.6s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="15" cy="50" r="2.5" fill="hsl(245, 100%, 75%)" transform="rotate(240 50 50)">
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="60 50 50"
            to="420 50 50"
            dur="18s"
            repeatCount="indefinite"
            additive="sum"
          />
          <animate
            attributeName="opacity"
            values="0.5;1;0.5"
            dur="1.5s"
            begin="1.1s"
            repeatCount="indefinite"
          />
        </circle>
      </g>

      {/* Central core with glow */}
      <g filter="url(#strong-glow)">
        <circle
          cx="50"
          cy="50"
          r="10"
          fill="url(#core-gradient)"
        >
          <animate
            attributeName="r"
            values="10;12;10"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </circle>
        {/* Inner bright core */}
        <circle
          cx="50"
          cy="50"
          r="6"
          fill="hsl(245, 100%, 75%)"
        >
          <animate
            attributeName="opacity"
            values="0.5;1;0.5"
            dur="3s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="r"
            values="6;7;6"
            dur="3s"
            repeatCount="indefinite"
          />
        </circle>
      </g>

      {/* Additional orbital particles */}
      <g opacity="0.6">
        <circle cx="50" cy="20" r="1.5" fill="hsl(225, 100%, 70%)">
          <animate
            attributeName="opacity"
            values="0.3;0.8;0.3"
            dur="2s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="80" cy="50" r="1.5" fill="hsl(270, 100%, 70%)">
          <animate
            attributeName="opacity"
            values="0.3;0.8;0.3"
            dur="2s"
            begin="0.5s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="50" cy="80" r="1.5" fill="hsl(245, 100%, 70%)">
          <animate
            attributeName="opacity"
            values="0.3;0.8;0.3"
            dur="2s"
            begin="1s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="20" cy="50" r="1.5" fill="hsl(225, 100%, 70%)">
          <animate
            attributeName="opacity"
            values="0.3;0.8;0.3"
            dur="2s"
            begin="1.5s"
            repeatCount="indefinite"
          />
        </circle>
      </g>
    </svg>
  );
};