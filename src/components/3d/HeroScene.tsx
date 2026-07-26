// @ts-nocheck
'use client'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei'
import Township from './Township'
import Particles from './Particles'

const HeroScene = () => {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [4, 3, 4], fov: 45 }}
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.3} />
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <pointLight position={[-3, 2, -3]} intensity={0.5} color="#C8A15A" />
        <pointLight position={[3, 1, 3]} intensity={0.3} color="#D8BC86" />

        {/* 3D Township Model */}
        <Township />

        {/* Particles */}
        <Particles count={150} />

        {/* Contact Shadows */}
        <ContactShadows
          position={[0, -0.49, 0]}
          opacity={0.4}
          scale={10}
          blur={2}
          far={4}
        />

        {/* Environment */}
        <Environment preset="night" />

        {/* Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2.2}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  )
}

export default HeroScene
