// Common Types
export interface ChartData {
  [key: string]: string | number;
}

export interface SheetData {
  id: string;
  name: string;
  data: ChartData[];
  columns: string[];
}

export interface JoinCondition {
  leftSheetId: string;
  rightSheetId: string;
  leftColumn: string;
  rightColumn: string;
  joinType: JoinType;
}

export type JoinType = 'inner' | 'left' | 'right' | 'full';

export interface ProcessedJoinResult {
  data: ChartData[];
  columns: string[];
  error?: string;
}

export interface DashboardConfig {
  chartType: 'line' | 'bar' | 'pie';
  selectedXAxis: string;
  selectedYAxes: string[];
  joinConditions: JoinCondition[];
  selectedSheetIds: string[];
  sheets: SheetData[]; // Added to store sheet data
}