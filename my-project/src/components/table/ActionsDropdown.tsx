import React, { useState } from 'react';
import { MoreHorizontal, Trash2, Edit, Star } from 'lucide-react';
import { TableRow, Status } from '@/types/table';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from '@/components/ui/dropdown-menu';

interface ActionsDropdownProps {
  row: TableRow;
  onDelete: (id: string) => Promise<boolean>;
  onUpdateStatus: (id: string, status: Status) => Promise<boolean>;
  onUpdateScore: (id: string, score: number) => Promise<boolean>;
}

const STATUS_OPTIONS: { value: Status; label: string }[] = [
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'pending', label: 'Pending' },
  { value: 'suspended', label: 'Suspended' },
];

const SCORE_OPTIONS = [10, 25, 50, 75, 90, 100];

export const ActionsDropdown: React.FC<ActionsDropdownProps> = ({
  row,
  onDelete,
  onUpdateStatus,
  onUpdateScore,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete ${row.name}?`)) {
      setIsLoading(true);
      try {
        await onDelete(row.id);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleStatusUpdate = async (status: Status) => {
    if (status === row.status) return;

    setIsLoading(true);
    try {
      await onUpdateStatus(row.id, status);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScoreUpdate = async (score: number) => {
    if (score === row.score) return;

    setIsLoading(true);
    try {
      await onUpdateScore(row.id, score);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 p-0"
          aria-label={`Actions for ${row.name}`}
          disabled={isLoading}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Edit className="mr-2 h-4 w-4" />
            Update Status
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {STATUS_OPTIONS.map((status) => (
              <DropdownMenuItem
                key={status.value}
                onClick={() => handleStatusUpdate(status.value)}
                disabled={status.value === row.status}
              >
                {status.label}
                {status.value === row.status && ' (current)'}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Star className="mr-2 h-4 w-4" />
            Update Score
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {SCORE_OPTIONS.map((score) => (
              <DropdownMenuItem
                key={score}
                onClick={() => handleScoreUpdate(score)}
                disabled={score === row.score}
              >
                {score}
                {score === row.score && ' (current)'}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDelete} variant="destructive">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
