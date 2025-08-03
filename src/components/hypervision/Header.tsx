import { Telescope } from 'lucide-react';

export function Header() {
  return (
    <header className="flex items-center justify-center gap-3 py-8">
      <Telescope className="h-10 w-10 text-primary" />
      <h1 className="text-4xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent font-headline">
        HyperVision
      </h1>
    </header>
  );
}
