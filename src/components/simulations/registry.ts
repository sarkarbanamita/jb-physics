import React from 'react';
import { SimulationType } from './types';
import dynamic from 'next/dynamic';

const ElectricFlux3D = dynamic(() => import('./components/ElectricFlux3D'), { ssr: false });
const CapacitorDielectric = dynamic(() => import('./components/CapacitorDielectric'), { ssr: false });
const ProjectileMotion = dynamic(() => import('./components/ProjectileMotion'), { ssr: false });

export const SIMULATION_REGISTRY: Record<string, {
  name: string;
  nameBn: string;
  description: string;
  component: React.ComponentType<any>;
}> = {
  ELECTRIC_FLUX_3D: {
    name: '3D Electric Flux Visualizer',
    nameBn: 'ত্রিমাত্রিক তড়িৎ ফ্লাক্স সিমুলেশন',
    description: 'Explore electric field vectors piercing through planes in 3D space with live dot product math.',
    component: ElectricFlux3D,
  },
  CAPACITOR_DIELECTRIC: {
    name: 'Capacitor & Dielectric Medium',
    nameBn: 'ধারক ও পরাবৈদ্যুতিক মাধ্যম',
    description: 'Insert dielectric slabs into parallel plate capacitors and observe capacitance, voltage, and energy changes.',
    component: CapacitorDielectric,
  },
  PROJECTILE_MOTION: {
    name: 'Projectile Motion Trajectory',
    nameBn: 'প্রাসের গতি ও গতিপথ',
    description: 'Launch projectiles at varying angles and velocities with live range and height physics calculations.',
    component: ProjectileMotion,
  },
};

export function getSimulation(type: string | null | undefined) {
  if (!type) return null;
  return SIMULATION_REGISTRY[type] || null;
}
