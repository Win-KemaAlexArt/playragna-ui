export const AnimatedLogo = ({ className = "", size = 48 }: { className?: string; size?: number }) => {
  return (
    <img 
      src="/logo.svg" 
      alt="PlayRAGNA Logo" 
      width={size} 
      height={size}
      className={className}
    />
  );
};