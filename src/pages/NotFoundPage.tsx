import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export function NotFoundPage() {
  return (
    <div className="grid min-h-screen place-items-center bg-slate-50 dark:bg-slate-950">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-slate-900 dark:text-white">404</h1>
        <p className="mt-2 text-slate-500">Page not found</p>
        <Link to="/" className="mt-6 inline-block"><Button>Back to Dashboard</Button></Link>
      </div>
    </div>
  );
}
