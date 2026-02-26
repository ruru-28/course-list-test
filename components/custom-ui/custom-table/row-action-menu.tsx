// components/custom-ui/custom-table/row-action-menu.tsx
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Ellipsis } from 'lucide-react';
import { APPS } from '@/types/ENUMS';
import React from 'react';
import Spinner from '#components/ui/spinner';
import { cn } from '@/lib/utils';

interface RowActionMenuProps {
  app?: APPS;
  isLoading?: boolean;
  menuItems: {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
    className?: string; // Added className to interface
  }[];
}

const RowActionMenu: React.FC<RowActionMenuProps> = ({
  menuItems,
  isLoading = false,
  app = APPS.PORTAL,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 p-0 rounded-md text-gray-500 hover:text-[var(--primary)] hover:bg-[var(--highlight)]"
          disabled={isLoading}
        >
          {isLoading ? (
            <Spinner size={16} />
          ) : (
            <Ellipsis className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[220px] p-1 rounded-lg shadow-lg border border-gray-100 bg-white"
      >
        {menuItems.map((item) => (
          <DropdownMenuItem
            key={item.label}
            className="px-3 py-2 gap-2 rounded-sm flex items-center cursor-pointer text-gray-700 [&_svg]:text-gray-400 hover:bg-[var(--highlight)] hover:text-[var(--primary)] hover:[&_svg]:text-[var(--primary)] focus:bg-[var(--highlight)] focus:text-[var(--primary)] focus:[&_svg]:text-[var(--primary)]"
            onClick={item.onClick}
          >
            {item.icon}
            <span className={cn("text-sm", item.className)}>
              {item.label}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RowActionMenu;
