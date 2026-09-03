export type SimulationType =
  | 'ELECTRIC_FLUX_3D'
  | 'CAPACITOR_DIELECTRIC'
  | 'PROJECTILE_MOTION'
  | 'COULOMB_FORCE'
  | 'CIRCUIT_OHM'
  | 'DRIFT_AND_RESISTANCE'
  | 'MAGNETIC_FIELD_CURRENTS'
  | 'CIRCUIT_INSTRUMENTS'
  | 'EARTH_MAGNETISM_DIPOLE'
  | 'EM_WAVES_SPECTRUM'
  | 'AC_CIRCUITS_TRANSFORMER';

export interface SimulationProps<T = any> {
  params?: T;
  onParameterChange?: (newParams: T) => void;
  className?: string;
}

export interface ElectricFluxParams {
  fieldVector?: [number, number, number]; // [Ex, Ey, Ez]
  plane?: 'YZ' | 'XZ' | 'XY';
  side?: number;
  expectedFlux?: number;
}

export interface CapacitorParams {
  initialDielectric?: number; // k1
  finalDielectric?: number;   // k2
  initialCapacitance?: number;// uF
  initialDistance?: number;   // mm
  mode?: 'DIELECTRIC_INSERTION' | 'CHARGE_SHARING' | 'SERIES_DIVIDER';
}

export interface DriftResistanceParams {
  voltage?: number;
  stretchFactor?: number;
  temperature?: number;
  mode?: 'STRETCH' | 'DRIFT' | 'IV_TEMP';
}

export interface MagneticFieldParams {
  current?: number;
  radius?: number;
  mode?: 'SEMICIRCLE' | 'SOLENOID' | 'PARALLEL_WIRES' | 'CIRCULAR_LOOP';
}

export interface CircuitInstrumentsParams {
  mode?: 'AMMETER_SHUNT' | 'POTENTIOMETER' | 'PARALLEL_CELLS' | 'WHEATSTONE';
  voltmeterResistance?: number;
  maxVoltage?: number;
  targetCurrent?: number;
  potentiometerLength?: number;
  balanceLength?: number;
  testEmf?: number;
  e1?: number;
  e2?: number;
  r1?: number;
  r2?: number;
}

export interface EarthMagnetismDipoleParams {
  mode?: 'DIP_CIRCLE' | 'BENT_WIRE' | 'FIELD_LINES' | 'NULL_POINT' | 'ROTATED_DIPOLE';
  bvRatio?: number;
  initialMoment?: number;
  q1?: number;
  q2?: number;
  distance?: number;
}

export interface EMWavesSpectrumParams {
  mode?: '3D_WAVE' | 'SPECTRUM_MATCH' | 'MEDIUM_SPEED';
  bField?: number;
  cSpeed?: number;
  permittivityRatio?: number;
  permeabilityRatio?: number;
}

export interface ACCircuitsParams {
  mode?: 'TRANSFORMER' | 'AC_SINE_RMS' | 'LCR_RESONANCE' | 'FARADAY_FLUX';
  primaryTurns?: number;
  primaryCurrent?: number;
  inputPower?: number;
  outputVoltage?: number;
  peakVoltage?: number;
  frequency?: number;
}

export interface ProjectileParams {
  velocity?: number; // m/s
  angle?: number;    // degrees
  gravity?: number;  // m/s^2
}

export interface CoulombParams {
  q1?: number; // microCoulombs
  q2?: number; // microCoulombs
  distance?: number; // cm
}

export interface CircuitParams {
  voltage?: number;
  r1?: number;
  r2?: number;
  config?: 'SERIES' | 'PARALLEL';
}


