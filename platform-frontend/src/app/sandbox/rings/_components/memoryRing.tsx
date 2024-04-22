import { ring } from "./nodeCard";
export function MemoryRing({
  memory,
  memoryCapacity,
}: {
  memory: number;
  memoryCapacity: number;
}) {
  const radius = 35;
  const circumfrence = 2 * Math.PI * radius;
  const memoryDecimal = memory / memoryCapacity;
  const memoryData = {
    radius: radius,
    circumfrence: circumfrence,
    strokeDashoffset: circumfrence * (1 - memoryDecimal / 2),
  } as ring;

  return (
    <circle
      cx="50"
      cy="50"
      r={memoryData.radius}
      fill="none"
      stroke="blue"
      strokeWidth="10"
      strokeDasharray={memoryData.circumfrence}
      strokeDashoffset={memoryData.strokeDashoffset}
      transform="rotate(180, 50, 50)"
    />
  );
}
