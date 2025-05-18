import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeftRight, 
  ArrowRight, 
  HelpCircle, 
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { SheetData, JoinCondition, JoinType, ProcessedJoinResult } from './types';
import { joinSheets } from './utils/dataProcessing';

interface JoinConfiguratorProps {
  selectedSheets: SheetData[];
  onJoinComplete: (result: ProcessedJoinResult) => void;
}

const JoinConfigurator: React.FC<JoinConfiguratorProps> = ({ 
  selectedSheets,
  onJoinComplete
}) => {
  const [leftSheetId, setLeftSheetId] = useState<string>('');
  const [rightSheetId, setRightSheetId] = useState<string>('');
  const [leftColumn, setLeftColumn] = useState<string>('');
  const [rightColumn, setRightColumn] = useState<string>('');
  const [joinType, setJoinType] = useState<JoinType>('inner');
  const [previewResult, setPreviewResult] = useState<ProcessedJoinResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Reset selected columns when selected sheets change
    setLeftColumn('');
    setRightColumn('');
    setPreviewResult(null);
  }, [leftSheetId, rightSheetId]);

  useEffect(() => {
    // Auto-select the first two sheets if available
    if (selectedSheets.length >= 1 && !leftSheetId) {
      setLeftSheetId(selectedSheets[0].id);
    }
    
    if (selectedSheets.length >= 2 && !rightSheetId) {
      setRightSheetId(selectedSheets[1].id);
    }
  }, [selectedSheets, leftSheetId, rightSheetId]);

  const leftSheet = selectedSheets.find(s => s.id === leftSheetId);
  const rightSheet = selectedSheets.find(s => s.id === rightSheetId);

  const handlePreviewJoin = () => {
    if (!leftSheet || !rightSheet || !leftColumn || !rightColumn) return;
    
    setIsLoading(true);
    
    try {
      const joinCondition: JoinCondition = {
        leftSheetId,
        rightSheetId,
        leftColumn,
        rightColumn,
        joinType
      };
      
      const result = joinSheets(leftSheet, rightSheet, joinCondition);
      setPreviewResult(result);
      
    } catch (error) {
      setPreviewResult({
        data: [],
        columns: [],
        error: `Join operation failed: ${error instanceof Error ? error.message : String(error)}`
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyJoin = () => {
    if (previewResult) {
      onJoinComplete(previewResult);
    }
  };

  const joinTypeInfo = {
    inner: "Returns rows when there is a match in both tables",
    left: "Returns all rows from the left table, and matched rows from the right table",
    right: "Returns all rows from the right table, and matched rows from the left table",
    full: "Returns all rows when there is a match in either left or right table"
  };

  // Check if configuration is valid
  const isConfigValid = leftSheetId && rightSheetId && leftColumn && rightColumn;
  const canPreview = isConfigValid && !isLoading;
  const canApply = previewResult && !previewResult.error && previewResult.data.length > 0;

  if (selectedSheets.length < 2) {
    return (
      <div className="bg-slate-800/50 rounded-lg p-6 text-center">
        <AlertTriangle size={32} className="mx-auto mb-3 text-amber-400" />
        <p className="text-slate-300">Please select at least 2 sheets to configure joins.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-slate-300 mb-4">Configure Join</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Left Table</label>
            <select
              value={leftSheetId}
              onChange={(e) => setLeftSheetId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
            >
              <option value="">Select left table</option>
              {selectedSheets.map((sheet) => (
                <option key={sheet.id} value={sheet.id}>
                  {sheet.name} ({sheet.data.length} rows)
                </option>
              ))}
            </select>
          </div>
          
          {leftSheet && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Left Join Column</label>
              <select
                value={leftColumn}
                onChange={(e) => setLeftColumn(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
              >
                <option value="">Select column</option>
                {leftSheet.columns.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Right Table</label>
            <select
              value={rightSheetId}
              onChange={(e) => setRightSheetId(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
            >
              <option value="">Select right table</option>
              {selectedSheets.map((sheet) => (
                <option key={sheet.id} value={sheet.id}>
                  {sheet.name} ({sheet.data.length} rows)
                </option>
              ))}
            </select>
          </div>
          
          {rightSheet && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Right Join Column</label>
              <select
                value={rightColumn}
                onChange={(e) => setRightColumn(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
              >
                <option value="">Select column</option>
                {rightSheet.columns.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          Join Type
          <span 
            className="ml-2 inline-block text-slate-500 cursor-help"
            title={joinTypeInfo[joinType]}
          >
            <HelpCircle size={14} />
          </span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {(['inner', 'left', 'right', 'full'] as JoinType[]).map((type) => (
            <div
              key={type}
              onClick={() => setJoinType(type)}
              className={`
                cursor-pointer border rounded-lg p-3 text-center 
                ${joinType === type 
                  ? 'bg-indigo-900/40 border-indigo-600' 
                  : 'bg-slate-800 border-slate-700 hover:border-slate-600'
                }
                transition-all duration-200
              `}
            >
              <div className="font-medium capitalize">{type}</div>
              <div className="text-xs text-slate-400 mt-1">{type} join</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-3 justify-center sm:justify-end pt-4">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handlePreviewJoin}
          disabled={!canPreview}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg 
            ${canPreview
              ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
              : 'bg-slate-700 text-slate-400 cursor-not-allowed'
            }
          `}
        >
          {isLoading ? <RefreshCw size={16} className="animate-spin" /> : <ArrowLeftRight size={16} />}
          Preview Join
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleApplyJoin}
          disabled={!canApply}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg 
            ${canApply
              ? 'bg-teal-600 hover:bg-teal-700 text-white'
              : 'bg-slate-700 text-slate-400 cursor-not-allowed'
            }
          `}
        >
          <ArrowRight size={16} />
          Apply Join
        </motion.button>
      </div>
      
      {previewResult && (
        <div className="mt-6 border border-slate-700 rounded-lg overflow-hidden">
          <div className="bg-slate-800 p-3 border-b border-slate-700 flex justify-between items-center">
            <div className="font-medium">Join Preview</div>
            <div className="text-xs text-slate-400">
              {previewResult.error 
                ? "Error" 
                : `${previewResult.data.length} rows × ${previewResult.columns.length} columns`
              }
            </div>
          </div>
          
          {previewResult.error ? (
            <div className="p-4 bg-red-900/20 border-l-4 border-red-600">
              <div className="flex items-start gap-3">
                <AlertTriangle size={20} className="text-red-500 mt-0.5" />
                <div>
                  <div className="font-medium text-red-400">Join Error</div>
                  <div className="text-slate-300 text-sm mt-1">{previewResult.error}</div>
                </div>
              </div>
            </div>
          ) : previewResult.data.length === 0 ? (
            <div className="p-4 bg-amber-900/20 border-l-4 border-amber-600">
              <div className="flex items-start gap-3">
                <AlertTriangle size={20} className="text-amber-500 mt-0.5" />
                <div>
                  <div className="font-medium text-amber-400">No Results</div>
                  <div className="text-slate-300 text-sm mt-1">
                    The join operation returned no matching rows. Try a different join type or columns.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-h-64 overflow-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-800/80 sticky top-0">
                  <tr>
                    {previewResult.columns.map((col, idx) => (
                      <th key={idx} className="px-3 py-2 text-left font-medium text-slate-300 whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {previewResult.data.slice(0, 5).map((row, rowIdx) => (
                    <tr key={rowIdx} className={rowIdx % 2 === 0 ? 'bg-slate-900/70' : 'bg-slate-800/30'}>
                      {previewResult.columns.map((col, colIdx) => (
                        <td key={colIdx} className="px-3 py-2 border-t border-slate-700">
                          {row[col] !== null && row[col] !== undefined ? String(row[col]) : ''}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {previewResult.data.length > 5 && (
                <div className="text-center py-2 text-xs text-slate-500 border-t border-slate-700 bg-slate-800/50">
                  Showing 5 of {previewResult.data.length} rows
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JoinConfigurator;