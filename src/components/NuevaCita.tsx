import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowLeft, Search, Calendar, User, GraduationCap, MapPin, FileText, Loader2, Filter, X } from "lucide-react";
import { useApprovedDoctors } from "../hooks/useDoctors";
import { useSpecialties } from "../hooks/useSpecialties";

export function NuevaCita() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSearch, setActiveSearch] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");

  const { data: specialties } = useSpecialties();
  const { data: doctors, isLoading, error } = useApprovedDoctors(activeSearch, selectedSpecialty);

  const handleSearch = () => {
    setActiveSearch(searchTerm);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/patient-dashboard")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Agendar Nueva Cita</h1>
            <p className="text-muted-foreground mt-1">Busca y selecciona un médico para tu consulta</p>
          </div>
        </div>

        {/* Buscador y Filtros */}
        <Card>
          <CardContent className="p-6 space-y-4">
            {/* Barra de búsqueda */}
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar médicos por nombre..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button
                className="bg-primary hover:bg-primary/90"
                onClick={handleSearch}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <Search className="h-5 w-5 mr-2" />
                )}
                Buscar
              </Button>
            </div>

            {/* Filtro por especialidad */}
            <div className="flex items-center gap-3">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">Filtrar por especialidad:</span>
              <div className="flex-1 flex gap-2 flex-wrap">
                <Button
                  variant={selectedSpecialty === "" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedSpecialty("")}
                >
                  Todas
                </Button>
                {specialties?.map((specialty) => (
                  <Button
                    key={specialty.id}
                    variant={selectedSpecialty === specialty.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSpecialty(specialty.id)}
                  >
                    {specialty.name}
                  </Button>
                ))}
              </div>
              {selectedSpecialty && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedSpecialty("")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Lista de médicos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-foreground">
              Médicos Disponibles
              {doctors && doctors.length > 0 && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({doctors.length} {doctors.length === 1 ? "médico" : "médicos"})
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="h-16 w-16 text-muted-foreground mx-auto mb-4 animate-spin" />
                <p className="text-muted-foreground">Cargando médicos...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <Calendar className="h-16 w-16 text-red-400 mx-auto mb-4" />
                <p className="text-red-600">Error al cargar los médicos</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Por favor, intenta nuevamente
                </p>
              </div>
            ) : !doctors || doctors.length === 0 ? (
              <div className="text-center py-12">
                <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {activeSearch
                    ? "No se encontraron médicos con ese criterio de búsqueda"
                    : "No hay médicos disponibles en este momento"}
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Intenta con otro término de búsqueda
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {doctors.map((doctor) => (
                  <Card
                    key={doctor.userId}
                    className="hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary"
                    onClick={() => navigate(`/nueva-cita/${doctor.userId}`)}
                  >
                    <CardContent className="p-6 space-y-4">
                      {/* Nombre del doctor */}
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            Dr. {doctor.firstName} {doctor.lastName}
                          </h3>
                          <p className="text-sm text-muted-foreground">{doctor.email}</p>
                        </div>
                        <User className="h-10 w-10 text-primary bg-primary/10 rounded-full p-2" />
                      </div>

                      {/* Especialidades */}
                      {doctor.specialties && doctor.specialties.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {doctor.specialties.map((specialty) => (
                            <Badge
                              key={specialty.id}
                              className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                            >
                              {specialty.name}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Información adicional */}
                      <div className="space-y-2 text-sm">
                        {doctor.yearsExperience && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <GraduationCap className="h-4 w-4" />
                            <span>{doctor.yearsExperience} años de experiencia</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <MapPin className="h-4 w-4" />
                          <span>Licencia: {doctor.licenseCountry}</span>
                        </div>
                      </div>

                      {/* Bio */}
                      {doctor.bio && (
                        <div className="pt-3 border-t">
                          <div className="flex items-start gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <p className="text-sm text-muted-foreground line-clamp-3">
                              {doctor.bio}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Botón de acción */}
                      <Button className="w-full bg-primary hover:bg-primary/90">
                        <Calendar className="h-4 w-4 mr-2" />
                        Agendar Cita
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
