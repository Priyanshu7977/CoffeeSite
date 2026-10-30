import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items, className = '' }) => {
  return (
    <nav
      aria-label="Breadcrumb navigation"
      className={`flex items-center text-xs sm:text-sm text-stone-500 overflow-x-auto whitespace-nowrap py-2 ${className}`}
    >
      <ol className="flex items-center space-x-1.5 sm:space-x-2">
        <li className="flex items-center">
          <Link
            to="/"
            className="flex items-center gap-1 hover:text-stone-900 transition-colors"
            title="Return to Noir Roast Home"
          >
            <Home className="w-3.5 h-3.5" />
            <span className="sr-only">Home</span>
          </Link>
        </li>

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.url} className="flex items-center space-x-1.5 sm:space-x-2">
              <ChevronRight className="w-3.5 h-3.5 text-stone-300 shrink-0" />
              {isLast ? (
                <span
                  aria-current="page"
                  className="font-semibold text-stone-900 truncate max-w-[200px] sm:max-w-none"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  to={item.url}
                  className="hover:text-stone-900 transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};
