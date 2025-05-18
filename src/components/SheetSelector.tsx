import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Check, FileSpreadsheet } from 'lucide-react';
import { SheetData } from './types/index';

interface SheetSelectorProps {
  sheets: SheetData[];
  selectedSheetIds: string[];
  onSelectSheet: (sheetId: string) => void;
}

const SheetSelector: React.FC<SheetSelectorProps> = ({ 
  sheets, 
  selectedSheetIds,
  onSelectSheet 
}) => {
  if (sheets.length === 0) {
    return (
      <div className="bg-slate-800/50 rounded-lg p-8 text-center">
        <Layers size={40} className="mx-auto mb-4 text-slate-500" />
        <p className="text-slate-400">No sheets available. Please upload an Excel file.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-slate-300 mb-3">Available Sheets</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sheets.map((sheet) => {
          const isSelected = selectedSheetIds.includes(sheet.id);
          
          return (
            <motion.div
              key={sheet.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectSheet(sheet.id)}
              className={`
                cursor-pointer p-4 rounded-lg border 
                ${isSelected 
                  ? 'bg-indigo-900/30 border-indigo-600' 
                  : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                }
                transition-all duration-200
              `}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet size={18} className={isSelected ? 'text-indigo-400' : 'text-slate-400'} />
                  <span className="font-medium truncate max-w-[140px]" title={sheet.name}>
                    {sheet.name}
                  </span>
                </div>
                {isSelected && (
                  <div className="bg-indigo-700/70 rounded-full p-1">
                    <Check size={14} className="text-white" />
                  </div>
                )}
              </div>
              
              <div className="text-slate-400 text-xs">
                {sheet.data.length} rows × {sheet.columns.length} columns
              </div>
              
              <div className="mt-2 flex flex-wrap gap-1">
                {sheet.columns.slice(0, 3).map((column, idx) => (
                  <span 
                    key={idx} 
                    className="text-xs bg-slate-700/50 rounded px-2 py-0.5 text-slate-300 truncate max-w-[80px]"
                    title={column}
                  >
                    {column}
                  </span>
                ))}
                {sheet.columns.length > 3 && (
                  <span className="text-xs bg-slate-700/50 rounded px-2 py-0.5 text-slate-300">
                    +{sheet.columns.length - 3}
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default SheetSelector;