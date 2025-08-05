import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import Container from '@/components/Container';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';

export default function NotFound() {
  useEffect(() => {
    // Optional tracking for monitoring
    navigator.sendBeacon?.(
      '/api/monitoring/404',
      JSON.stringify({ path: window.location.pathname })
    );
  }, []);

  return (
    <Container className="flex h-screen flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-2xl font-bold">404 - Pagina nu a fost găsită</h1>
      <p className="text-muted-foreground">Pagina accesată nu există.</p>
      <div className="flex gap-4">
        <Button asChild>
          <Link to={ROUTES.DASHBOARD}>Dashboard</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link to={ROUTES.LOGIN}>Login</Link>
        </Button>
      </div>
    </Container>
  );
}