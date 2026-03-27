"use client"
import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls as DreiOrbitControls, Environment, useGLTF } from '@react-three/drei'
import { Suspense, useEffect, useRef } from 'react'
import type { OrbitControls as OrbitControlsType } from 'three-stdlib'
import * as THREE from 'three'

function isMesh(node: THREE.Object3D): node is THREE.Mesh {
  return (node as THREE.Mesh).isMesh === true
}

function GLBScene({ controlsRef }: { controlsRef: React.RefObject<OrbitControlsType | null> }) {
  const gltf = useGLTF('/landingPage/Untitled4.glb')
  const { camera } = useThree()
  const sphereRef = useRef<THREE.Object3D | null>(null)

  useEffect(() => {
    const sphere =
      gltf.scene.getObjectByName('Side_left') ||
      gltf.scene.children.find(obj => obj.name.toLowerCase().includes('cube'))

    gltf.scene.traverse((node) => {
      if (!isMesh(node)) return

      const m = Array.isArray(node.material) ? node.material[0] : node.material
      if (!m) return

      if ("envMap" in m) (m as THREE.MeshStandardMaterial).envMap = null
      if ("envMapIntensity" in m) (m as THREE.MeshStandardMaterial).envMapIntensity = 0

      if ("metalness" in m) (m as THREE.MeshStandardMaterial).metalness = 0
      if ("roughness" in m) (m as THREE.MeshStandardMaterial).roughness = 1

      if ("clearcoat" in m) (m as THREE.MeshPhysicalMaterial).clearcoat = 0
      if ("clearcoatRoughness" in m) (m as THREE.MeshPhysicalMaterial).clearcoatRoughness = 1
      if ("ior" in m) (m as THREE.MeshPhysicalMaterial).ior = 1.0
      if ("specularIntensity" in m) (m as THREE.MeshPhysicalMaterial).specularIntensity = 0

      if ("metalnessMap" in m) (m as THREE.MeshStandardMaterial).metalnessMap = null
      if ("roughnessMap" in m) (m as THREE.MeshStandardMaterial).roughnessMap = null

      if ("shininess" in m) (m as THREE.MeshPhongMaterial).shininess = 0
      if ("specular" in m) (m as THREE.MeshPhongMaterial).specular?.set?.(0x000000)

      m.needsUpdate = true
    })

    if (sphere) {
      sphereRef.current = sphere

      const box = new THREE.Box3().setFromObject(sphere)
      const center = box.getCenter(new THREE.Vector3())

      camera.position.set(center.x + 0.4, center.y + 0.09, center.z + 0.2)
      camera.lookAt(center)

      if (controlsRef.current) {
        controlsRef.current.target.copy(center)
        controlsRef.current.update()
      }
    }
  }, [gltf, camera, controlsRef])

  return <primitive object={gltf.scene} />
}

export default function GLBModelViewer() {
  const controlsRef = useRef<OrbitControlsType | null>(null)

  return (
    <Canvas camera={{ position: [0, 0.1, 0], fov: 22 }}>
      <ambientLight intensity={1} />

      <Suspense fallback={null}>
        <GLBScene controlsRef={controlsRef} />
        <Environment preset="dawn" background={false} />
      </Suspense>

      <DreiOrbitControls
        ref={controlsRef}
        makeDefault
        target={[0, 0.3, 0]}
        enablePan={false}
        enableZoom={false}
        enableRotate={true}
        minAzimuthAngle={THREE.MathUtils.degToRad(0)}
        maxAzimuthAngle={THREE.MathUtils.degToRad(90)}
        minPolarAngle={THREE.MathUtils.degToRad(70)}
        maxPolarAngle={THREE.MathUtils.degToRad(90)}
      />
    </Canvas>
  )
}
