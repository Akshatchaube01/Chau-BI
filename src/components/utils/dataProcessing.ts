import { ChartData, SheetData, JoinCondition, ProcessedJoinResult, JoinType, DashboardConfig } from '../types';

/**
 * Saves the current dashboard configuration to a JSON file
 */
export const saveConfiguration = (config: DashboardConfig): string => {
  try {
    const configString = JSON.stringify(config, null, 2);
    const blob = new Blob([configString], { type: 'application/json' });
    return URL.createObjectURL(blob);
  } catch (error) {
    throw new Error('Failed to save configuration');
  }
};

/**
 * Loads dashboard configuration from a JSON file
 */
export const loadConfiguration = async (file: File): Promise<DashboardConfig> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        if (!e.target?.result) {
          throw new Error('Failed to read file');
        }
        
        const config = JSON.parse(e.target.result as string);
        
        // Validate configuration structure
        if (!config.chartType || !Array.isArray(config.selectedYAxes)) {
          throw new Error('Invalid configuration format');
        }
        
        resolve(config);
      } catch (error) {
        reject(new Error('Invalid configuration file'));
      }
    };
    
    reader.onerror = () => reject(new Error('Failed to read configuration file'));
    reader.readAsText(file);
  });
};

/**
 * Performs a join operation between two sheets based on the specified join condition.
 */
export const joinSheets = (
  leftSheet: SheetData,
  rightSheet: SheetData,
  joinCondition: JoinCondition
): ProcessedJoinResult => {
  try {
    const { leftColumn, rightColumn, joinType } = joinCondition;
    
    // Validate column existence
    if (!leftSheet.columns.includes(leftColumn)) {
      return { 
        data: [], 
        columns: [], 
        error: `Column "${leftColumn}" not found in sheet "${leftSheet.name}"` 
      };
    }
    
    if (!rightSheet.columns.includes(rightColumn)) {
      return { 
        data: [], 
        columns: [], 
        error: `Column "${rightColumn}" not found in sheet "${rightSheet.name}"` 
      };
    }
    
    // Create a map for faster lookups of right sheet data
    const rightDataMap = new Map<string | number, ChartData[]>();
    rightSheet.data.forEach(rightRow => {
      const key = rightRow[rightColumn];
      if (!rightDataMap.has(key)) {
        rightDataMap.set(key, []);
      }
      rightDataMap.get(key)?.push(rightRow);
    });
    
    // Prepare result columns (prevent duplicate column names)
    const resultColumns: string[] = [...leftSheet.columns];
    rightSheet.columns.forEach(col => {
      if (col !== rightColumn || joinType === 'full') {
        // For columns with the same name, prefix with sheet name
        const newColName = leftSheet.columns.includes(col) && col !== rightColumn
          ? `${rightSheet.name}_${col}`
          : col;
        
        if (!resultColumns.includes(newColName)) {
          resultColumns.push(newColName);
        }
      }
    });
    
    let joinedData: ChartData[] = [];
    
    // Perform the join based on the specified join type
    switch (joinType) {
      case 'inner':
        joinedData = performInnerJoin(leftSheet, rightSheet, leftColumn, rightColumn, rightDataMap, resultColumns);
        break;
      case 'left':
        joinedData = performLeftJoin(leftSheet, rightSheet, leftColumn, rightColumn, rightDataMap, resultColumns);
        break;
      case 'right':
        joinedData = performRightJoin(leftSheet, rightSheet, leftColumn, rightColumn, rightDataMap, resultColumns);
        break;
      case 'full':
        joinedData = performFullJoin(leftSheet, rightSheet, leftColumn, rightColumn, rightDataMap, resultColumns);
        break;
      default:
        return { 
          data: [], 
          columns: [], 
          error: `Invalid join type: ${joinType}` 
        };
    }
    
    return { data: joinedData, columns: resultColumns };
  } catch (error) {
    return { 
      data: [], 
      columns: [], 
      error: `Error performing join: ${error instanceof Error ? error.message : String(error)}` 
    };
  }
};

/**
 * Performs an inner join between two sheets.
 */
const performInnerJoin = (
  leftSheet: SheetData,
  rightSheet: SheetData,
  leftColumn: string,
  rightColumn: string,
  rightDataMap: Map<string | number, ChartData[]>,
  resultColumns: string[]
): ChartData[] => {
  const result: ChartData[] = [];
  
  leftSheet.data.forEach(leftRow => {
    const leftKey = leftRow[leftColumn];
    const matchingRightRows = rightDataMap.get(leftKey);
    
    if (matchingRightRows && matchingRightRows.length > 0) {
      matchingRightRows.forEach(rightRow => {
        const joinedRow: ChartData = {};
        
        // Add left row data
        resultColumns.forEach(col => {
          if (leftSheet.columns.includes(col)) {
            joinedRow[col] = leftRow[col];
          }
        });
        
        // Add right row data (handling column name conflicts)
        rightSheet.columns.forEach(col => {
          if (col !== rightColumn || col === rightColumn && !leftSheet.columns.includes(col)) {
            const targetCol = leftSheet.columns.includes(col) && col !== rightColumn
              ? `${rightSheet.name}_${col}`
              : col;
            
            joinedRow[targetCol] = rightRow[col];
          }
        });
        
        result.push(joinedRow);
      });
    }
  });
  
  return result;
};

/**
 * Performs a left join between two sheets.
 */
const performLeftJoin = (
  leftSheet: SheetData,
  rightSheet: SheetData,
  leftColumn: string,
  rightColumn: string,
  rightDataMap: Map<string | number, ChartData[]>,
  resultColumns: string[]
): ChartData[] => {
  const result: ChartData[] = [];
  
  leftSheet.data.forEach(leftRow => {
    const leftKey = leftRow[leftColumn];
    const matchingRightRows = rightDataMap.get(leftKey);
    
    if (matchingRightRows && matchingRightRows.length > 0) {
      // If there are matching rows in the right sheet
      matchingRightRows.forEach(rightRow => {
        const joinedRow: ChartData = {};
        
        // Add left row data
        resultColumns.forEach(col => {
          if (leftSheet.columns.includes(col)) {
            joinedRow[col] = leftRow[col];
          }
        });
        
        // Add right row data (handling column name conflicts)
        rightSheet.columns.forEach(col => {
          if (col !== rightColumn || col === rightColumn && !leftSheet.columns.includes(col)) {
            const targetCol = leftSheet.columns.includes(col) && col !== rightColumn
              ? `${rightSheet.name}_${col}`
              : col;
            
            joinedRow[targetCol] = rightRow[col];
          }
        });
        
        result.push(joinedRow);
      });
    } else {
      // If no matching rows in the right sheet, still include the left row
      const joinedRow: ChartData = {};
      
      // Add left row data
      resultColumns.forEach(col => {
        if (leftSheet.columns.includes(col)) {
          joinedRow[col] = leftRow[col];
        } else {
          joinedRow[col] = null; // Null for right columns
        }
      });
      
      result.push(joinedRow);
    }
  });
  
  return result;
};

/**
 * Performs a right join between two sheets.
 */
const performRightJoin = (
  leftSheet: SheetData,
  rightSheet: SheetData,
  leftColumn: string,
  rightColumn: string,
  rightDataMap: Map<string | number, ChartData[]>,
  resultColumns: string[]
): ChartData[] => {
  // Create a map for left sheet data
  const leftDataMap = new Map<string | number, ChartData[]>();
  leftSheet.data.forEach(leftRow => {
    const key = leftRow[leftColumn];
    if (!leftDataMap.has(key)) {
      leftDataMap.set(key, []);
    }
    leftDataMap.get(key)?.push(leftRow);
  });
  
  const result: ChartData[] = [];
  
  // Process all right rows
  rightSheet.data.forEach(rightRow => {
    const rightKey = rightRow[rightColumn];
    const matchingLeftRows = leftDataMap.get(rightKey);
    
    if (matchingLeftRows && matchingLeftRows.length > 0) {
      // If there are matching rows in the left sheet
      matchingLeftRows.forEach(leftRow => {
        const joinedRow: ChartData = {};
        
        // Add left row data
        resultColumns.forEach(col => {
          if (leftSheet.columns.includes(col)) {
            joinedRow[col] = leftRow[col];
          }
        });
        
        // Add right row data (handling column name conflicts)
        rightSheet.columns.forEach(col => {
          if (col !== rightColumn || col === rightColumn && !leftSheet.columns.includes(col)) {
            const targetCol = leftSheet.columns.includes(col) && col !== rightColumn
              ? `${rightSheet.name}_${col}`
              : col;
            
            joinedRow[targetCol] = rightRow[col];
          }
        });
        
        result.push(joinedRow);
      });
    } else {
      // If no matching rows in the left sheet, still include the right row
      const joinedRow: ChartData = {};
      
      // Add null for left columns
      leftSheet.columns.forEach(col => {
        joinedRow[col] = null;
      });
      
      // Add right row data
      rightSheet.columns.forEach(col => {
        const targetCol = leftSheet.columns.includes(col) && col !== rightColumn
          ? `${rightSheet.name}_${col}`
          : col;
        
        joinedRow[targetCol] = rightRow[col];
      });
      
      result.push(joinedRow);
    }
  });
  
  return result;
};

/**
 * Performs a full outer join between two sheets.
 */
const performFullJoin = (
  leftSheet: SheetData,
  rightSheet: SheetData,
  leftColumn: string,
  rightColumn: string,
  rightDataMap: Map<string | number, ChartData[]>,
  resultColumns: string[]
): ChartData[] => {
  // First, get all left join results
  const leftJoinResults = performLeftJoin(
    leftSheet, rightSheet, leftColumn, rightColumn, rightDataMap, resultColumns
  );
  
  // Create a set of left keys that have been processed
  const processedLeftKeys = new Set<string | number>(
    leftSheet.data.map(row => row[leftColumn])
  );
  
  // Now add right-only rows (ones with right keys that don't exist in left sheet)
  rightSheet.data.forEach(rightRow => {
    const rightKey = rightRow[rightColumn];
    
    if (!processedLeftKeys.has(rightKey)) {
      const joinedRow: ChartData = {};
      
      // Add null for left columns
      leftSheet.columns.forEach(col => {
        joinedRow[col] = null;
      });
      
      // Add right row data
      rightSheet.columns.forEach(col => {
        const targetCol = leftSheet.columns.includes(col) && col !== rightColumn
          ? `${rightSheet.name}_${col}`
          : col;
        
        joinedRow[targetCol] = rightRow[col];
      });
      
      leftJoinResults.push(joinedRow);
    }
  });
  
  return leftJoinResults;
};

/**
 * Generates a unique ID for sheets
 */
export const generateSheetId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};