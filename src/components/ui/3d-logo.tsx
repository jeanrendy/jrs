"use client";

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import { useTheme } from 'next-themes';
import * as THREE from 'three';

function Model({ color }: { color: string }) {
    const { scene } = useGLTF('/assets/jrslogoblack.glb');

    // Clone scene to avoid modifying the cached original
    const clonedScene = useMemo(() => scene.clone(), [scene]);

    const ref = useRef<THREE.Group>(null);

    useFrame((state, delta) => {
        if (ref.current) {
            ref.current.rotation.y += delta * 0.5; // Slow rotation
        }
    });

    // Apply color
    useMemo(() => {
        clonedScene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                // Ensure material is standard and we can set color
                // This replaces textures if any, assuming simple geometry logo
                if (mesh.material) {
                    const mat = mesh.material as THREE.MeshStandardMaterial;
                    mat.color.set(color);
                    mat.roughness = 0.4;
                    mat.metalness = 0.2;
                    mat.needsUpdate = true;
                }
            }
        });
    }, [clonedScene, color]);

    return <primitive object={clonedScene} ref={ref} scale={0.5} />;
}

export function ThreeDLogo() {
    const { resolvedTheme } = useTheme();
    const color = resolvedTheme === 'dark' ? '#ffffff' : '#000000';

    return (
        <div className="w-12 h-12 flex items-center justify-center">
            <Canvas camera={{ position: [0, 0, 8], fov: 45 }} gl={{ alpha: true, antialias: true, preserveDrawingBuffer: true }}>
                <ambientLight intensity={1.5} />
                <directionalLight position={[5, 5, 5]} intensity={2} />
                <Center>
                    <Model color={color} />
                </Center>
            </Canvas>
        </div>
    );
}

useGLTF.preload('/assets/jrslogoblack.glb');
