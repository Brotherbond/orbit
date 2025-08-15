export interface Vehicle {
  uuid: string;
  type: string; // vehicle type
  fuel_per_km: number; // fuel consumption per km in liters
  height: number; // vehicle height in meters
  length: number; // vehicle length in meters
  width: number; // vehicle width in meters
  max_weight: number; // maximum weight capacity in kg
  vehicle_number: string;
  created_at: string;

  // registration_number: string; // vehicle registration number
  // model: string; // vehicle model
  // make: string; // vehicle make
  // year: number; // manufacturing year
  // color: string; // vehicle color
  // vin: string; // vehicle identification number
  // mileage: number; // current mileage in km
}
