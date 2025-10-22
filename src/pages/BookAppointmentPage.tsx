/**
 * BookAppointmentPage.tsx
 * Página wrapper que obtiene el doctorId de la URL y pasa los datos al componente BookAppointment
 */

import { useParams } from "react-router-dom";
import { BookAppointment } from "@/components/patient/BookAppointment";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

interface DoctorInfo {
  Id: number;
  FullName: string;
  Specialty?: string;
}

export function BookAppointmentPage() {
  const { doctorId } = useParams<{ doctorId: string }>();

  // Obtener información del doctor (asumiendo que existe un endpoint)
  const { data: doctor, isLoading } = useQuery({
    queryKey: ["doctors", doctorId],
    queryFn: async () => {
      try {
        const { data } = await api.get<DoctorInfo>(`/doctors/${doctorId}`);
        return data;
      } catch (err) {
        // Si no existe el endpoint, usar valores por defecto
        return {
          Id: Number(doctorId),
          FullName: "Doctor",
          Specialty: undefined,
        };
      }
    },
    enabled: !!doctorId,
  });

  if (!doctorId) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Error</h2>
          <p className="text-muted-foreground">No se especificó un doctor</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando información del doctor...</p>
        </div>
      </div>
    );
  }

  return (
    <BookAppointment
      doctorId={Number(doctorId)}
      doctorName={doctor?.FullName || "Doctor"}
      doctorSpecialty={doctor?.Specialty}
    />
  );
}
