/**
 * EJEMPLO 3: Página con parámetros de ruta dinámicos
 *
 * Ruta: /users/:id
 * Endpoint: GET /users/:id
 */
import { useRouteData } from '../../hooks/useRouteData';
import { DataLoader } from '../DataLoader';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useNavigate } from 'react-router-dom';

// Tipo de datos del usuario
interface UserDetail {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  avatar?: string;
  bio?: string;
  joinedAt: string;
  stats: {
    appointments: number;
    reviews: number;
    rating: number;
  };
}

export function UserDetailPage() {
  const navigate = useNavigate();

  // Hook que automáticamente reemplaza :id con el parámetro de la URL
  const { data, loading, error, errorMessage, refetch } = useRouteData<UserDetail>({
    endpoint: '/users/:id', // :id se reemplaza automáticamente
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="outline" onClick={() => navigate('/users')}>
          ← Volver a la lista
        </Button>

        <DataLoader
          loading={loading}
          error={error}
          errorMessage={errorMessage}
          data={data}
          onRetry={refetch}
          loadingMessage="Cargando perfil del usuario..."
        >
          {(user) => (
            <div className="space-y-6">
              {/* Cabecera del perfil */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-6">
                    <Avatar className="h-24 w-24">
                      <AvatarFallback className="text-2xl">
                        {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h1 className="text-3xl font-bold">{user.name}</h1>
                      <p className="text-muted-foreground">{user.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                          {user.status === 'active' ? 'Activo' : 'Inactivo'}
                        </Badge>
                        <Badge variant="outline">{user.role}</Badge>
                      </div>
                    </div>
                  </div>
                  {user.bio && (
                    <p className="mt-4 text-muted-foreground">{user.bio}</p>
                  )}
                </CardContent>
              </Card>

              {/* Estadísticas */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-3xl font-bold text-primary">{user.stats.appointments}</p>
                    <p className="text-sm text-muted-foreground">Citas Totales</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-3xl font-bold text-primary">{user.stats.reviews}</p>
                    <p className="text-sm text-muted-foreground">Reseñas</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-3xl font-bold text-primary">{user.stats.rating.toFixed(1)}</p>
                    <p className="text-sm text-muted-foreground">Calificación</p>
                  </CardContent>
                </Card>
              </div>

              {/* Información adicional */}
              <Card>
                <CardHeader>
                  <CardTitle>Información Adicional</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Miembro desde: {new Date(user.joinedAt).toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </DataLoader>
      </div>
    </div>
  );
}
