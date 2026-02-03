import { Home, ChevronRight } from 'lucide-react';
import { splitPath, buildPathFromSegments } from '@utils/pathUtils';

interface BreadcrumbsProps {
  path: string;
  onNavigate: (path: string) => void;
}

export function Breadcrumbs({ path, onNavigate }: BreadcrumbsProps) {
  const segments = path ? splitPath(path) : [];

  return (
    <div className="flex items-center gap-2 text-sm">
      <button
        onClick={() => onNavigate('')}
        className="flex items-center gap-2 px-2 py-1 rounded hover:bg-surface-hover transition-colors text-text-secondary hover:text-text-primary"
      >
        <Home className="w-4 h-4" />
        <span>Inicio</span>
      </button>

      {segments.map((segment, index) => {
        const segmentPath = buildPathFromSegments(segments.slice(0, index + 1));
        const isLast = index === segments.length - 1;

        return (
          <div key={index} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-text-muted" />
            <button
              onClick={() => onNavigate(segmentPath)}
              className={`px-2 py-1 rounded transition-colors ${
                isLast
                  ? 'text-text-primary font-medium'
                  : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
              }`}
            >
              {segment}
            </button>
          </div>
        );
      })}
    </div>
  );
}
