import { useGLTF } from '@react-three/drei'

export default function Model() {
  const { scene } = useGLTF('/riddle-15/scene.glb')
  
  return (
    <>
      <primitive object={scene} />
    </>
  )
}
