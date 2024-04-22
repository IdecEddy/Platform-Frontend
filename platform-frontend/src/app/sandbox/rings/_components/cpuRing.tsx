import { ring } from "./nodeCard";
export function CpuRing({
  cpu,
  cpuCapacity,
}: {
  cpu: number;
  cpuCapacity: number;
}) {
  const radius = 45;
  const circumfrence = 2 * Math.PI * radius;
  const cpuDecimal = cpu / cpuCapacity;
  const cpuData = {
    radius: radius,
    circumfrence: circumfrence,
    strokeDashoffset: circumfrence * (1 - cpuDecimal / 2),
  } as ring;

  return (
    <circle
      cx="50"
      cy="50"
      r={cpuData.radius}
      fill="none"
      stroke="green"
      strokeWidth="10"
      strokeDasharray={cpuData.circumfrence}
      strokeDashoffset={cpuData.strokeDashoffset}
      transform="rotate(180, 50, 50)"
    />
  );
}
