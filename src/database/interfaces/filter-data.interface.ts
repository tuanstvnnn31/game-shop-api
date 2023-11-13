export interface FilterData {
  pageSize: number;
  current: number;
  limit: number;
  sort_direction: string; // asc | desc
  sort_column: string;
  filters: Filter[];
  prefix_filter_field: string;
}

interface Filter {
  field: string;
  operator: string;
  value: any;
}
