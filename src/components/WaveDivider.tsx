"use client";

interface WaveDividerProps {
  topColor?: string;
  bottomColor?: string;
  lineColor?: string;
  showLine?: boolean;
  className?: string;
}

export function WaveDivider({
  topColor = "transparent",
  bottomColor = "var(--color-dark)",
  lineColor = "#E44134",
  showLine = false,
  className = "",
}: WaveDividerProps) {
  return (
    <div className={`w-full leading-[0] overflow-hidden -mb-px ${className}`}>
      <svg
        viewBox="0 0 1200 200"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto block"
        preserveAspectRatio="none"
      >
        {/* Background = top section color */}
        <rect width="1200" height="200" fill={topColor} />
        {/* Wave fill = bottom section color */}
        <path
          d="M0,65c0,0,348.3,76.3,603,72.3s477-27.3,597-27.3v90H0V65z"
          fill={bottomColor}
        />
        {/* Optional red wave line */}
        {showLine && (
          <path
            d="M0,65c0,0,348.3,76.3,603,72.3s477-27.3,597-27.3"
            fill="none"
            stroke={lineColor}
            strokeWidth="8"
            strokeLinecap="square"
          />
        )}
      </svg>
    </div>
  );
}
