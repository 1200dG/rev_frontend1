import { Points, PointMaterial } from '@react-three/drei'

interface FixedStarsProps {
  positions: number[][];
  size?: number;
}

export default function FixedStars({ positions, size = 0.5 }: FixedStarsProps) {
  return (
    <Points positions={new Float32Array(positions.flat())}>
      <PointMaterial color="white" size={size} sizeAttenuation />
    </Points>
  )
}
