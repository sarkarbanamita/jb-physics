export type SimulationType =
  | 'ELECTRIC_FLUX_3D'
  | 'CAPACITOR_DIELECTRIC'
  | 'PROJECTILE_MOTION'
  | 'COULOMB_FORCE'
  | 'CIRCUIT_OHM';

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
