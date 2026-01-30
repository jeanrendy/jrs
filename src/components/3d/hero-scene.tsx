"use client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, TorusKnot } from "@react-three/drei";
import { useRef } from "react";

function MetallicShape() {
    const meshRef = useRef(null);

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (meshRef.current) {
            // @ts-expect-error - rotation exists on Object3D
            meshRef.current.rotation.x = t * 0.2;
            // @ts-expect-error - rotation exists on Object3D
            meshRef.current.rotation.y = t * 0.3;
        }
    });

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1}>
            <TorusKnot args={[0.8, 0.3, 128, 16]} scale={2.5} ref={meshRef}>
                <meshStandardMaterial
                    color="#ffffff"
                    roughness={0.1}
                    metalness={1}
                    envMapIntensity={2}
                />
            </TorusKnot>
        </Float>
    );
}

export function HeroScene() {
    return (
        <div className="absolute inset-0 z-0 h-full w-full pointer-events-none">
            <Canvas className="h-full w-full" camera={{ position: [0, 0, 8], fov: 45 }}>
                {/* Warm Studio Lighting for Metallic look */}
                <ambientLight intensity={0.5} />
                <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="orange" />
                <spotLight position={[-10, -10, -10]} angle={0.15} penumbra={1} intensity={2} color="blue" />
                <Environment preset="studio" />
                <MetallicShape />
            </Canvas>
        </div>
    );
}
