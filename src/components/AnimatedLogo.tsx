import logoSvg from '/logo.svg?url'

export const AnimatedLogo = ({ className = "", size = 48 }: { className?: string; size?: number }) => {
  return (
    <img 
      src={logoSvg} 
      alt="PlayRAGNA Logo" 
      width={size} 
      height={size}
      className={className}
    />
  );
};