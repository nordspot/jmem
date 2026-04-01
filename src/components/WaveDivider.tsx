import Image from "next/image";

interface WaveDividerProps {
  variant?: "wave1" | "wave2";
  flip?: boolean;
  className?: string;
}

export function WaveDivider({
  variant = "wave1",
  flip = false,
  className = "",
}: WaveDividerProps) {
  const src =
    variant === "wave1" ? "/images/site/wave.svg" : "/images/site/wave2.svg";

  return (
    <div
      className={`w-full leading-[0] overflow-hidden ${flip ? "rotate-180" : ""} ${className}`}
    >
      <Image
        src={src}
        alt=""
        width={1440}
        height={120}
        className="w-full h-auto block"
        priority
      />
    </div>
  );
}
