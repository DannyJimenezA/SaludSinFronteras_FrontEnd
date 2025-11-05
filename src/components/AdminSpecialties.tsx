import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  ArrowLeft,
  Plus,
  Pencil,
  Trash2,
  Loader2,
  X,
  Check,
} from "lucide-react";
import {
  useSpecialties,
  useCreateSpecialty,
  useUpdateSpecialty,
  useDeleteSpecialty,
  Specialty,
} from "../hooks/useSpecialties";
import { toast } from "sonner";

export function AdminSpecialties() {
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);
  const [newSpecialtyName, setNewSpecialtyName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  const { data: specialties, isLoading } = useSpecialties();
  const createSpecialty = useCreateSpecialty();
  const updateSpecialty = useUpdateSpecialty();
  const deleteSpecialty = useDeleteSpecialty();

  const handleCreate = async () => {
    if (!newSpecialtyName.trim()) {
      toast.error("El nombre de la especialidad es requerido");
      return;
    }

    try {
      await createSpecialty.mutateAsync({ Name: newSpecialtyName.trim() });
      toast.success("Especialidad creada exitosamente");
      setNewSpecialtyName("");
      setIsAdding(false);
    } catch (error: any) {
      toast.error("Error al crear especialidad", {
        description:
          error.response?.data?.message || "Por favor, intenta nuevamente",
      });
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editingName.trim()) {
      toast.error("El nombre de la especialidad es requerido");
      return;
    }

    try {
      await updateSpecialty.mutateAsync({ id, Name: editingName.trim() });
      toast.success("Especialidad actualizada exitosamente");
      setEditingId(null);
      setEditingName("");
    } catch (error: any) {
      toast.error("Error al actualizar especialidad", {
        description:
          error.response?.data?.message || "Por favor, intenta nuevamente",
      });
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (
      !window.confirm(
        `¿Estás seguro de eliminar la especialidad "${name}"?\n\nNota: No podrás eliminarla si tiene doctores asociados.`
      )
    ) {
      return;
    }

    try {
      await deleteSpecialty.mutateAsync(id);
      toast.success("Especialidad eliminada exitosamente");
    } catch (error: any) {
      toast.error("Error al eliminar especialidad", {
        description:
          error.response?.data?.message || "Por favor, intenta nuevamente",
      });
    }
  };

  const startEdit = (specialty: Specialty) => {
    setEditingId(specialty.id);
    setEditingName(specialty.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate("/admin-panel")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Gestión de Especialidades
              </h1>
              <p className="text-muted-foreground mt-1">
                Administra las especialidades médicas del sistema
              </p>
            </div>
          </div>
          <Button
            className="bg-primary hover:bg-primary/90"
            onClick={() => setIsAdding(true)}
            disabled={isAdding}
          >
            <Plus className="h-5 w-5 mr-2" />
            Nueva Especialidad
          </Button>
        </div>

        {/* Formulario de nueva especialidad */}
        {isAdding && (
          <Card className="border-2 border-primary">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground">
                    Nombre de la Especialidad
                  </label>
                  <input
                    type="text"
                    value={newSpecialtyName}
                    onChange={(e) => setNewSpecialtyName(e.target.value)}
                    placeholder="Ej: Cardiología"
                    className="w-full mt-2 px-4 py-3 bg-background border border-input rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    autoFocus
                  />
                </div>
                <div className="flex gap-2">
                  <Button
                    className="flex-1 bg-primary hover:bg-primary/90"
                    onClick={handleCreate}
                    disabled={createSpecialty.isPending}
                  >
                    {createSpecialty.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Creando...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Crear
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAdding(false);
                      setNewSpecialtyName("");
                    }}
                    disabled={createSpecialty.isPending}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Lista de especialidades */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl text-foreground">
              Especialidades Registradas
              {specialties && (
                <span className="text-sm font-normal text-muted-foreground ml-2">
                  ({specialties.length}{" "}
                  {specialties.length === 1 ? "especialidad" : "especialidades"}
                  )
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <Loader2 className="h-16 w-16 text-muted-foreground mx-auto mb-4 animate-spin" />
                <p className="text-muted-foreground">Cargando especialidades...</p>
              </div>
            ) : !specialties || specialties.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No hay especialidades registradas
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Crea la primera especialidad usando el botón superior
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {specialties.map((specialty) => (
                  <div
                    key={specialty.id}
                    className="flex items-center justify-between p-4 border border-input rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    {editingId === specialty.id ? (
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="flex-1 px-3 py-2 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                          autoFocus
                        />
                        <Button
                          size="sm"
                          onClick={() => handleUpdate(specialty.id)}
                          disabled={updateSpecialty.isPending}
                        >
                          {updateSpecialty.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={cancelEdit}
                          disabled={updateSpecialty.isPending}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3">
                          <Badge className="bg-blue-50 text-blue-700">
                            {specialty.name}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            ID: {specialty.id}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEdit(specialty)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() =>
                              handleDelete(specialty.id, specialty.name)
                            }
                            disabled={deleteSpecialty.isPending}
                          >
                            {deleteSpecialty.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
