// @ts-nocheck
'use client'
import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface BuildingProps {
  position: [number, number, number]
  scale: [number, number, number]
  color?: string
}

const Building = ({ position, scale, color = '#2D2D44' }: BuildingProps) => {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={scale} />
      <meshStandardMaterial color={color} roughness={0.7} metalness={0.3} />
    </mesh>
  )
}

const Road = ({ position, size }: { position: [number, number, number]; size: [number, number, number] }) => {
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[size[0], size[2]]} />
      <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
    </mesh>
  )
}

const Tree = ({ position }: { position: [number, number, number] }) => {
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.03, 0.3, 6]} />
        <meshStandardMaterial color="#5C3D2E" />
      </mesh>
      {/* Leaves */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <coneGeometry args={[0.12, 0.35, 6]} />
        <meshStandardMaterial color="#2D5A27" />
      </mesh>
    </group>
  )
}

const Township = () => {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1
    }
  })

  const buildings = useMemo(() => [
    // Main buildings
    { pos: [0, 0.5, 0] as [number, number, number], scale: [0.6, 1.0, 0.6] as [number, number, number], color: '#C8A15A' },
    { pos: [-1.2, 0.35, 0.5] as [number, number, number], scale: [0.5, 0.7, 0.5] as [number, number, number], color: '#2D2D44' },
    { pos: [1.0, 0.4, -0.8] as [number, number, number], scale: [0.4, 0.8, 0.4] as [number, number, number], color: '#3D3D54' },
    { pos: [-0.5, 0.3, -1.2] as [number, number, number], scale: [0.5, 0.6, 0.4] as [number, number, number], color: '#2D2D44' },
    { pos: [1.5, 0.25, 0.8] as [number, number, number], scale: [0.3, 0.5, 0.6] as [number, number, number], color: '#3D3D54' },
    { pos: [-1.5, 0.2, -0.5] as [number, number, number], scale: [0.4, 0.4, 0.4] as [number, number, number], color: '#4D4D64' },
    { pos: [0.8, 0.3, 1.2] as [number, number, number], scale: [0.35, 0.6, 0.35] as [number, number, number], color: '#2D2D44' },
    { pos: [-0.8, 0.45, 1.0] as [number, number, number], scale: [0.45, 0.9, 0.45] as [number, number, number], color: '#A67B2C' },
    // Smaller houses
    { pos: [2.0, 0.15, 0] as [number, number, number], scale: [0.25, 0.3, 0.25] as [number, number, number], color: '#4D4D64' },
    { pos: [-2.0, 0.15, 1.0] as [number, number, number], scale: [0.25, 0.3, 0.3] as [number, number, number], color: '#4D4D64' },
    { pos: [0, 0.15, 2.0] as [number, number, number], scale: [0.3, 0.3, 0.25] as [number, number, number], color: '#3D3D54' },
    { pos: [-1.8, 0.15, -1.5] as [number, number, number], scale: [0.25, 0.3, 0.25] as [number, number, number], color: '#4D4D64' },
  ], [])

  const trees = useMemo(() => [
    [1.8, 0, 1.5],
    [-1.8, 0, -1.8],
    [2.2, 0, -1.0],
    [-2.2, 0, 0.3],
    [0.3, 0, -2.0],
    [-0.3, 0, 2.2],
    [2.5, 0, 0.5],
    [-2.5, 0, -0.8],
  ] as [number, number, number][], [])

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <circleGeometry args={[3.5, 32]} />
        <meshStandardMaterial color="#1A3A1A" roughness={1} />
      </mesh>

      {/* Roads */}
      <Road position={[0, 0.01, 0]} size={[6, 0, 0.3]} />
      <Road position={[0, 0.01, 0]} size={[0.3, 0, 6]} />

      {/* Buildings */}
      {buildings.map((b, i) => (
        <Building key={i} position={b.pos} scale={b.scale} color={b.color} />
      ))}

      {/* Trees */}
      {trees.map((pos, i) => (
        <Tree key={i} position={pos} />
      ))}

      {/* Gate entrance */}
      <group position={[0, 0, 3.2]}>
        <mesh position={[-0.2, 0.2, 0]} castShadow>
          <boxGeometry args={[0.08, 0.4, 0.08]} />
          <meshStandardMaterial color="#C8A15A" />
        </mesh>
        <mesh position={[0.2, 0.2, 0]} castShadow>
          <boxGeometry args={[0.08, 0.4, 0.08]} />
          <meshStandardMaterial color="#C8A15A" />
        </mesh>
        <mesh position={[0, 0.4, 0]} castShadow>
          <boxGeometry args={[0.5, 0.05, 0.08]} />
          <meshStandardMaterial color="#C8A15A" />
        </mesh>
      </group>
    </group>
  )
}

export default Township
