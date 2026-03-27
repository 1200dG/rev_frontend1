import * as THREE from 'three'
import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"
import Model from "./Model"
import FixedStars from "./FixedStars"
import { Environment, OrbitControls } from "@react-three/drei"
import { digit42Positions, starPositions } from "@/lib/constants/riddle-15"

export default function Riddle15() {
  return (
    <>
      <Canvas camera={{ position: [0, 0.3, 0], fov: 40 }}>
        <ambientLight intensity={0.3} />
        <pointLight
          position={[5, 5, 5]}
          intensity={0.8}
        />

        <Suspense fallback={null}>
          <Model />
          <FixedStars positions={digit42Positions} size={0.1} />
          <FixedStars positions={starPositions} size={0.1} />
          <color attach="background" args={['black']} />
          <Environment files="/hdr/venice_sunset_4k.exr" />
        </Suspense>

        <OrbitControls
          target={[0, 0.3, 0]}
          enablePan={false}
          enableZoom={false}
          enableRotate={true}
          minPolarAngle={THREE.MathUtils.degToRad(80)}
          maxPolarAngle={THREE.MathUtils.degToRad(170)}
        />

      </Canvas>
    </>
  )
}
