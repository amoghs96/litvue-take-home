export interface TableRow {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  score: number;
  department: string;
  joinDate: string;
  lastActive: string;
  isSelected?: boolean;
}

export type Role =
  | 'admin'
  | 'manager'
  | 'developer'
  | 'designer'
  | 'analyst'
  | 'intern';

export type Status = 'active' | 'inactive' | 'pending' | 'suspended';

export interface FilterState {
  nameFilter: string;
  roleFilter: Role | '';
  statusFilter: Status | '';
}

export interface FilteredTableData {
  data: TableRow[];
  filteredData: TableRow[];
  filters: FilterState;
  loading: boolean;
  error: string | null;
  selectedRows: Set<string>;
  totalCount: number;
  filteredCount: number;
}

export interface TableProps {
  data: TableRow[];
  loading?: boolean;
  onRowSelect?: (id: string, selected: boolean) => void;
  onBulkSelect?: (selected: boolean) => void;
  selectedRows?: Set<string>;
}

export interface VirtualizedTableProps extends TableProps {
  height: number;
  rowHeight: number;
}
