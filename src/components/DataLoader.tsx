/**
 * Componente genérico para manejar estados de carga, error y datos
 * Simplifica el renderizado condicional de componentes conectados al backend
 */
import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';

interface DataLoaderProps<T> {
  /** Si está cargando */
  loading: boolean;

  /** Error si ocurrió */
  error: Error | null;

  /** Mensaje de error personalizado */
  errorMessage?: string | null;

  /** Datos recibidos */
  data: T | null;

  /** Función para reintentar la petición */
  onRetry?: () => void;

  /** Componente/función a renderizar cuando hay datos */
  children: (data: T) => ReactNode;

  /** Mensaje personalizado mientras carga */
  loadingMessage?: string;

  /** Componente personalizado para el estado de carga */
  loadingComponent?: ReactNode;

  /** Componente personalizado para el estado de error */
  errorComponent?: (error: Error, message: string | null, retry?: () => void) => ReactNode;

  /** Mensaje cuando no hay datos */
  emptyMessage?: string;

  /** Componente personalizado cuando no hay datos */
  emptyComponent?: ReactNode;

  /** Validación personalizada para determinar si hay datos */
  isEmpty?: (data: T | null) => boolean;
}

/**
 * Componente que maneja automáticamente los estados de carga, error y datos
 *
 * @example
 * <DataLoader
 *   loading={loading}
 *   error={error}
 *   data={data}
 *   onRetry={refetch}
 * >
 *   {(data) => <div>{data.title}</div>}
 * </DataLoader>
 */
export function DataLoader<T = any>({
  loading,
  error,
  errorMessage,
  data,
  onRetry,
  children,
  loadingMessage = 'Cargando datos...',
  loadingComponent,
  errorComponent,
  emptyMessage = 'No hay datos disponibles',
  emptyComponent,
  isEmpty,
}: DataLoaderProps<T>) {

  // Estado de carga
  if (loading) {
    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }

    return (
      <div className="flex flex-col items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground text-sm">{loadingMessage}</p>
      </div>
    );
  }

  // Estado de error
  if (error) {
    if (errorComponent) {
      return <>{errorComponent(error, errorMessage, onRetry)}</>;
    }

    return (
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-700">
            <AlertCircle className="h-5 w-5" />
            Error al cargar los datos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-red-600">
            {errorMessage || error.message || 'Ocurrió un error desconocido'}
          </p>
          {onRetry && (
            <Button
              variant="outline"
              onClick={onRetry}
              className="w-full"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // Verificar si está vacío
  const dataIsEmpty = isEmpty
    ? isEmpty(data)
    : data === null || data === undefined || (Array.isArray(data) && data.length === 0);

  if (dataIsEmpty) {
    if (emptyComponent) {
      return <>{emptyComponent}</>;
    }

    return (
      <Card>
        <CardContent className="p-12">
          <div className="text-center">
            <p className="text-muted-foreground">{emptyMessage}</p>
            {onRetry && (
              <Button
                variant="outline"
                onClick={onRetry}
                className="mt-4"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Renderizar datos
  return <>{children(data!)}</>;
}
