import { api } from "../lib/api";

export type Specialty = { id: number; name: string };

// TODO: CAMBIA AL PATH REAL EN NEST
const SPECS_PATH = "/api/specialties";

export async function listSpecialties() {
  const { data } = await api.get<Specialty[]>(SPECS_PATH);
  return data;
}
