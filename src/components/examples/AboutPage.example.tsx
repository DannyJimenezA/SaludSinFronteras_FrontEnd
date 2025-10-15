/**
 * EJEMPLO 1: Componente About conectado dinámicamente al backend
 *
 * Ruta: /about
 * Endpoint: GET /api/about
 */
import { useRouteData } from '../../hooks/useRouteData';
import { DataLoader } from '../DataLoader';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

// Tipo de datos esperados del backend
interface AboutData {
  title: string;
  description: string;
  mission: string;
  vision: string;
  team: Array<{
    id: number;
    name: string;
    role: string;
    bio: string;
  }>;
}

export function AboutPage() {
  // Hook que automáticamente conecta con /api/about
  const { data, loading, error, errorMessage, refetch } = useRouteData<AboutData>({
    endpoint: '/about', // Se convierte en GET /about (api.ts ya tiene el prefijo)
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-primary">Acerca de Nosotros</h1>

        {/* DataLoader maneja automáticamente loading, error y datos */}
        <DataLoader
          loading={loading}
          error={error}
          errorMessage={errorMessage}
          data={data}
          onRetry={refetch}
          loadingMessage="Cargando información..."
        >
          {(aboutData) => (
            <div className="space-y-6">
              {/* Título y descripción */}
              <Card>
                <CardHeader>
                  <CardTitle>{aboutData.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{aboutData.description}</p>
                </CardContent>
              </Card>

              {/* Misión y Visión */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Nuestra Misión</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{aboutData.mission}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Nuestra Visión</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{aboutData.vision}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Equipo */}
              <Card>
                <CardHeader>
                  <CardTitle>Nuestro Equipo</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {aboutData.team.map((member) => (
                      <div key={member.id} className="p-4 border rounded-lg">
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-sm text-primary">{member.role}</p>
                        <p className="text-sm text-muted-foreground mt-2">{member.bio}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DataLoader>
      </div>
    </div>
  );
}
