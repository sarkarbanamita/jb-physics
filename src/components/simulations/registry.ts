import React from 'react';
import { SimulationType } from './types';
import dynamic from 'next/dynamic';

const ElectricFlux3D = dynamic(() => import('./components/ElectricFlux3D'), { ssr: false });
const CapacitorDielectric = dynamic(() => import('./components/CapacitorDielectric'), { ssr: false });
const ProjectileMotion = dynamic(() => import('./components/ProjectileMotion'), { ssr: false });
const DriftVelocityResistance = dynamic(() => import('./components/DriftVelocityResistance'), { ssr: false });
const MagneticFieldCurrents = dynamic(() => import('./components/MagneticFieldCurrents'), { ssr: false });
const CircuitInstruments = dynamic(() => import('./components/CircuitInstruments'), { ssr: false });
const EarthMagnetismDipole = dynamic(() => import('./components/EarthMagnetismDipole'), { ssr: false });
const ACCircuitsEMWaves = dynamic(() => import('./components/ACCircuitsEMWaves'), { ssr: false });

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
  DRIFT_AND_RESISTANCE: {
    name: 'Drift Velocity & Resistance Mechanics',
    nameBn: 'বিচলন বেগ ও তার টানার রোধ পরিবর্তন',
    description: 'Visualize electron drift velocity under electric fields, wire stretching volume conservation x²R, and I-V temperature characteristics.',
    component: DriftVelocityResistance,
  },
  MAGNETIC_FIELD_CURRENTS: {
    name: 'Biot-Savart & Magnetic Forces',
    nameBn: 'বায়ো-সাভার্ট সূত্র ও চৌম্বক বল সিমুলেশন',
    description: 'Simulate magnetic fields around semicircular arcs, ideal solenoids, circular loops, and force between parallel conductors.',
    component: MagneticFieldCurrents,
  },
  CIRCUIT_INSTRUMENTS: {
    name: 'Potentiometers, Meters & Circuit Networks',
    nameBn: 'পোটেনশিওমিটার, অ্যামিটার শান্ট ও বর্তনী',
    description: 'Interactive potentiometer wire balancing, voltmeter-to-ammeter shunt calculations, Wheatstone bridge, and parallel cell combinations.',
    component: CircuitInstruments,
  },
  EARTH_MAGNETISM_DIPOLE: {
    name: 'Earth Magnetism & Dipole Dynamics',
    nameBn: 'ভূ-চুম্বকত্ব ও চৌম্বক দ্বিমেরু সিমুলেশন',
    description: 'Simulate dip circle dip angle, bent wire magnetic moment 2M/π, electric field lines density, and charge null points.',
    component: EarthMagnetismDipole,
  },
  EM_WAVES_SPECTRUM: {
    name: '3D EM Waves & Spectrum',
    nameBn: 'ত্রিমাত্রিক তড়িৎচুম্বকীয় তরঙ্গ ও বর্ণালী',
    description: 'Explore orthogonal E and B field wave propagation in 3D space, speed in dielectric media, and EM spectrum matching.',
    component: ACCircuitsEMWaves,
  },
  AC_CIRCUITS_TRANSFORMER: {
    name: 'AC Circuits, Transformer & Faraday Induction',
    nameBn: 'পরিবর্তী প্রবাহ, ট্রান্সফরমার ও আবেশ',
    description: 'Step-up/step-down transformer turns ratio, AC RMS and average phasor dynamics, series LCR resonance, and Faraday flux induction.',
    component: ACCircuitsEMWaves,
  },
};

export function getSimulation(type: string | null | undefined) {
  if (!type) return null;
  return SIMULATION_REGISTRY[type] || null;
}

