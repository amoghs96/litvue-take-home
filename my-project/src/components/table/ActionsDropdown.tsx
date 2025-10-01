import React, { useState } from 'react';
import { MoreHorizontal, Trash2, Edit, ArrowUpDown } from 'lucide-react';
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
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { toast } from 'sonner';

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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDeleteConfirm = async () => {
    setIsLoading(true);
    try {
      const success = await onDelete(row.id);
      if (success) {
        toast.success(`${row.name} has been deleted successfully`);
      } else {
        toast.error('Failed to delete record. Please try again.');
      }
    } catch {
      toast.error('An error occurred while deleting the record');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (status: Status) => {
    if (status === row.status) return;

    setIsLoading(true);
    try {
      const success = await onUpdateStatus(row.id, status);
      if (success) {
        toast.success(`Status updated to ${status} for ${row.name}`);
      } else {
        toast.error('Failed to update status. Please try again.');
      }
    } catch {
      toast.error('An error occurred while updating status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleScoreUpdate = async (score: number) => {
    if (score === row.score) return;

    setIsLoading(true);
    try {
      const success = await onUpdateScore(row.id, score);
      if (success) {
        toast.success(`Score updated to ${score} for ${row.name}`);
      } else {
        toast.error('Failed to update score. Please try again.');
      }
    } catch {
      toast.error('An error occurred while updating score');
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
            <ArrowUpDown className="mr-2 h-4 w-4" />
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
        <DropdownMenuItem
          onClick={() => setShowDeleteDialog(true)}
          variant="destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>

      <ConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Employee"
        description={`Are you sure you want to delete ${row.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
        isLoading={isLoading}
      />
    </DropdownMenu>
  );
};
