import React, { useState, useRef, useEffect } from 'react'; 
import html2canvas from 'html2canvas'; 
import { motion } from 'framer-motion';
import { jsPDF } from 'jspdf';
import { 
  ArrowLeft, 
  BarChart, 
  PieChart, 
  LineChart, 
  Users, 
  Activity, 
  TrendingUp, 
  Upload,
  Download, 
  Layers,
  ChevronDown,
  ChevronUp,
  Table,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { read, utils, writeFile } from 'xlsx';
import { 
  LineChart as RechartsLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  BarChart as RechartsBarChart, 
  Bar, 
  PieChart as RechartsPieChart, 
  Pie, 
  Cell 
} from 'recharts';

import StatCard from '../components/StatCard';
import ActivityItem from '../components/ActivityItem';
import SheetSelector from '../components/SheetSelector';
import JoinConfigurator from '../components/JoinConfigurator';
import { ChartData, SheetData, ProcessedJoinResult, DashboardConfig, JoinCondition } from './types';
import { generateSheetId, saveConfiguration, loadConfiguration } from './utils/dataProcessing';

const DashboardPage: React.FC = () => {
  // Chart configuration state
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('line');
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedXAxis, setSelectedXAxis] = useState<string>('');
  const [selectedYAxes, setSelectedYAxes] = useState<string[]>([]);
  
  // Sheet management state
  const [sheets, setSheets] = useState<SheetData[]>([]);
  const [selectedSheetIds, setSelectedSheetIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'upload' | 'sheets' | 'join'>('upload');
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    dataImport: true,
    chartConfig: true,
  });
  const [joinConditions, setJoinConditions] = useState<JoinCondition[]>([]);
  
  // UI state
  const [dataSelectionComplete, setDataSelectionComplete] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const chartRef = useRef<HTMLDivElement>(null);

  const handleSaveConfig = () => {
    const config: DashboardConfig = {
      chartType,
      selectedXAxis,
      selectedYAxes,
      joinConditions,
      selectedSheetIds,
      sheets // Include sheet data for proper restoration
    };
    
    const configUrl = saveConfiguration(config);
    const link = document.createElement('a');
    link.href = configUrl;
    link.download = `dashboard-config-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(configUrl);
    
    setSuccessMessage('Configuration saved successfully!');
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const handleLoadConfig = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const config = await loadConfiguration(file);
      
      // Validate configuration
      if (!config.chartType || !Array.isArray(config.selectedYAxes)) {
        throw new Error('Invalid configuration format');
      }

      // Update all state in the correct order
      setSheets(config.sheets || []);
      setSelectedSheetIds(config.selectedSheetIds || []);
      setJoinConditions(config.joinConditions || []);
      
      // Only set axes if they exist in the current columns
      if (config.selectedXAxis && config.sheets?.[0]?.columns.includes(config.selectedXAxis)) {
        setSelectedXAxis(config.selectedXAxis);
      }
      
      if (config.selectedYAxes.every(axis => config.sheets?.[0]?.columns.includes(axis))) {
        setSelectedYAxes(config.selectedYAxes);
      }
      
      setChartType(config.chartType);
      
      // If we have sheets and selections, update chart data
      if (config.sheets?.[0]) {
        setChartData(config.sheets[0].data);
        setColumns(config.sheets[0].columns);
        setDataSelectionComplete(true);
      }
      
      setSuccessMessage('Configuration loaded successfully!');
      setTimeout(() => setSuccessMessage(null), 5000);
    } catch (error) {
      console.error('Error loading configuration:', error);
      setErrorMessage('Failed to load configuration. Please check the file format.');
      setTimeout(() => setErrorMessage(null), 5000);
    }
    
    // Clear the input to allow loading the same file again
    event.target.value = '';
  };

  // Reset chart data when switching to join tab to avoid confusion
  useEffect(() => {
    if (activeTab === 'join') {
      setChartData([]);
      setColumns([]);
      setSelectedXAxis('');
      setSelectedYAxes([]);
      setDataSelectionComplete(false);
    }
  }, [activeTab]);

  // Select default sheet when only one is available
  useEffect(() => {
    if (sheets.length === 1 && selectedSheetIds.length === 0) {
      setSelectedSheetIds([sheets[0].id]);
    }
  }, [sheets]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (!e.target?.result) return;
      
      try {
        const data = new Uint8Array(e.target.result as ArrayBuffer);
        const workbook = read(data, { type: 'array' });
        
        // Process each sheet in the workbook
        const extractedSheets: SheetData[] = workbook.SheetNames.map(sheetName => {
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = utils.sheet_to_json<ChartData>(worksheet);
          
          // Get columns from the first row
          const sheetColumns = jsonData.length > 0 ? Object.keys(jsonData[0]) : [];
          
          return {
            id: generateSheetId(),
            name: sheetName,
            data: jsonData,
            columns: sheetColumns
          };
        }).filter(sheet => sheet.data.length > 0 && sheet.columns.length > 0);
        
        if (extractedSheets.length > 0) {
          setSheets(prev => [...prev, ...extractedSheets]);
          setSuccessMessage(`Successfully imported ${extractedSheets.length} sheet${extractedSheets.length > 1 ? 's' : ''} from ${file.name}`);
          
          // Auto-select the 'sheets' tab after upload
          setActiveTab('sheets');
          
          // Clear after 5 seconds
          setTimeout(() => setSuccessMessage(null), 5000);
        }
      } catch (error) {
        console.error('Error processing file:', error);
        setErrorMessage('Failed to process file. Please check the format.');
        setTimeout(() => setErrorMessage(null), 5000);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSelectSheet = (sheetId: string) => {
    // Toggle selection
    setSelectedSheetIds(prev => {
      if (prev.includes(sheetId)) {
        return prev.filter(id => id !== sheetId);
      } else {
        return [...prev, sheetId];
      }
    });
  };

  const handleUseSelectedSheet = () => {
    if (selectedSheetIds.length !== 1) return;
    
    const selectedSheet = sheets.find(s => s.id === selectedSheetIds[0]);
    if (!selectedSheet) return;
    
    // Use the selected sheet for visualization
    setChartData(selectedSheet.data);
    setColumns(selectedSheet.columns);
    
    // Select default axes
    if (selectedSheet.columns.length > 0) {
      setSelectedXAxis(selectedSheet.columns[0]);
      
      // Find numeric columns for Y axes
      const numericColumns = selectedSheet.columns.filter(col => 
        typeof selectedSheet.data[0][col] === 'number'
      );
      
      setSelectedYAxes(numericColumns.slice(0, 2));
    }
    
    setDataSelectionComplete(true);
    setActiveTab('upload');
  };

  const handleJoinComplete = (result: ProcessedJoinResult) => {
    if (result.error || result.data.length === 0) {
      setErrorMessage(result.error || 'Join operation failed');
      setTimeout(() => setErrorMessage(null), 5000);
      return;
    }
    
    // Use the join result for visualization
    setChartData(result.data);
    setColumns(result.columns);
    
    // Select default axes
    if (result.columns.length > 0) {
      setSelectedXAxis(result.columns[0]);
      
      // Find numeric columns for Y axes
      const numericColumns = result.columns.filter(col => 
        typeof result.data[0][col] === 'number'
      );
      
      setSelectedYAxes(numericColumns.slice(0, 2));
    }
    
    setDataSelectionComplete(true);
    setActiveTab('upload');
    
    setSuccessMessage('Join operation completed successfully!');
    setTimeout(() => setSuccessMessage(null), 5000);
  };

  const handleDownloadChart = async () => {
    if (!chartRef.current) return;
  
    const canvas = await html2canvas(chartRef.current);
    const link = document.createElement('a');
    link.download = `chart-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const handleDownloadCSV = () => {
    if (!chartData.length) return;
  
    const csvRows: string[] = [];
  
    // Header
    csvRows.push(columns.join(','));
  
    // Rows
    chartData.forEach(row => {
      const values = columns.map(col => JSON.stringify(row[col] ?? ''));
      csvRows.push(values.join(','));
    });
  
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `data-export-${Date.now()}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const handleDownloadXLSX = () => {
    if (!chartData.length) return;
  
    const worksheet = utils.json_to_sheet(chartData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'ChartData');
    writeFile(workbook, `data-export-${Date.now()}.xlsx`);
  };

  const handleExportPDF = () => {
    if (!chartRef.current) return;
    html2canvas(chartRef.current).then((canvas) => {
      const pdf = new jsPDF();
      const imgData = canvas.toDataURL('image/png');
      pdf.addImage(imgData, 'PNG', 10, 10, 180, 160);
      pdf.setFontSize(12);
      pdf.text('Analytics Report', 10, 180);
      pdf.text('Date: ' + new Date().toLocaleDateString(), 10, 190);
      pdf.save('chart_report.pdf');
    });
  };

  const renderChart = () => {
    if (!chartData.length) return null;

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

    switch (chartType) {
      case 'line':
        return (
          <RechartsLineChart width={600} height={300} data={chartData} className="mx-auto">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={selectedXAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            {selectedYAxes.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={COLORS[index % COLORS.length]}
              />
            ))}
          </RechartsLineChart>
        );
      case 'bar':
        return (
          <RechartsBarChart width={600} height={300} data={chartData} className="mx-auto">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={selectedXAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            {selectedYAxes.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </RechartsBarChart>
        );
      
      case 'pie':
        if (selectedYAxes.length === 0) return null;
        return (
          <RechartsPieChart width={400} height={300} className="mx-auto">
            <Pie
              data={chartData}
              cx={200}
              cy={150}
              labelLine={false}
              nameKey={selectedXAxis}
              dataKey={selectedYAxes[0]}
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </RechartsPieChart>
        );
    }
  };

  const isChartDataAvailable = chartData.length > 0;
  
  const selectedSheets = sheets.filter(s => selectedSheetIds.includes(s.id));

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="bg-indigo-950 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="text-white hover:text-teal-400 transition-colors flex items-center gap-2">
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-indigo-500 flex items-center justify-center">
              <span className="font-bold">AC</span>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4 mt-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard 
              title="Users" 
              value="14,856" 
              change="+12.5%" 
              icon={<Users size={24} className="text-teal-400" />} 
            />
            <StatCard 
              title="Active Sessions" 
              value="2,485" 
              change="+8.2%" 
              icon={<Activity size={24} className="text-indigo-400" />} 
            />
            <StatCard 
              title="Conversion Rate" 
              value="3.8%" 
              change="+0.6%" 
              icon={<TrendingUp size={24} className="text-purple-400" />} 
            />
          </div>

          {successMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-green-900/40 border-l-4 border-green-500 rounded-md p-4 mb-6 flex items-start"
            >
              <CheckCircle2 size={20} className="text-green-500 mr-3 mt-0.5" />
              <div>
                <div className="font-medium text-green-400">Success</div>
                <div className="text-slate-300">{successMessage}</div>
              </div>
            </motion.div>
          )}

          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-red-900/40 border-l-4 border-red-500 rounded-md p-4 mb-6 flex items-start"
            >
              <CheckCircle2 size={20} className="text-red-500 mr-3 mt-0.5" />
              <div>
                <div className="font-medium text-red-400">Error</div>
                <div className="text-slate-300">{errorMessage}</div>
              </div>
            </motion.div>
          )}

          <div className="bg-slate-900/70 rounded-xl p-6 border border-slate-800 mb-8">
            <div className="flex justify-end gap-4 mb-6">
              <button
                onClick={handleSaveConfig}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-700 rounded-lg flex items-center gap-2"
              >
                <Download size={16} />
                Save Config
              </button>
              <div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleLoadConfig}
                  className="hidden"
                  id="config-upload"
                />
                <label
                  htmlFor="config-upload"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer inline-flex items-center gap-2"
                >
                  <Upload size={16} />
                  Load Config
                </label>
              </div>
            </div>

            <div className="flex mb-6 border-b border-slate-700">
              <button
                onClick={() => setActiveTab('upload')}
                className={`px-4 py-3 font-medium text-sm relative ${
                  activeTab === 'upload' 
                    ? 'text-teal-400 border-b-2 border-teal-400' 
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Upload size={16} />
                  <span>Upload Data</span>
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('sheets')}
                className={`px-4 py-3 font-medium text-sm relative ${
                  activeTab === 'sheets' 
                    ? 'text-indigo-400 border-b-2 border-indigo-400' 
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Table size={16} />
                  <span>Select Sheet</span>
                  {sheets.length > 0 && (
                    <span className="bg-indigo-900 text-indigo-300 text-xs px-2 py-0.5 rounded-full">
                      {sheets.length}
                    </span>
                  )}
                </div>
              </button>
              
              <button
                onClick={() => setActiveTab('join')}
                className={`px-4 py-3 font-medium text-sm relative ${
                  activeTab === 'join' 
                    ? 'text-purple-400 border-b-2 border-purple-400' 
                    : 'text-slate-400 hover:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Layers size={16} />
                  <span>Join Sheets</span>
                </div>
              </button>
            </div>
            
            <div>
              {activeTab === 'upload' && (
                <div className="space-y-6">
                  {/* Data Import Section */}
                  <div>
                    <div 
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleSection('dataImport')}
                    >
                      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <Upload size={20} className="text-teal-400" />
                        Import Data
                      </h2>
                      <div className="text-slate-400">
                        {expandedSections.dataImport ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </div>
                    
                    {expandedSections.dataImport && (
                      <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center">
                        <Upload size={32} className="mx-auto mb-4 text-slate-400" />
                        <p className="text-slate-300 mb-4">Upload your Excel file with multiple sheets</p>
                        <input
                          type="file"
                          accept=".xlsx,.xls"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                        />
                        <label
                          htmlFor="file-upload"
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg cursor-pointer inline-block"
                        >
                          Choose File
                        </label>
                      </div>
                    )}
                  </div>
                  
                  {/* Chart Configuration Section */}
                  <div>
                    <div 
                      className="flex justify-between items-center cursor-pointer"
                      onClick={() => toggleSection('chartConfig')}
                    >
                      <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                        <BarChart size={20} className="text-indigo-400" />
                        Chart Configuration
                      </h2>
                      <div className="text-slate-400">
                        {expandedSections.chartConfig ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </div>
                    </div>
                    
                    {expandedSections.chartConfig && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-slate-300 mb-2">Chart Type</label>
                          <select
                            value={chartType}
                            onChange={(e) => setChartType(e.target.value as 'line' | 'bar' | 'pie')}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                          >
                            <option value="line">Line Chart</option>
                            <option value="bar">Bar Chart</option>
                            <option value="pie">Pie Chart</option>
                          </select>
                        </div>
                        
                        {columns.length > 0 && (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-slate-300 mb-2">X Axis</label>
                              <select
                                value={selectedXAxis}
                                onChange={(e) => setSelectedXAxis(e.target.value)}
                                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                              >
                                {columns.map((column) => (
                                  <option key={column} value={column}>{column}</option>
                                ))}
                              </select>
                            </div>
                            <div className="relative">
                              <label className="block text-sm font-medium text-slate-300 mb-2">Y Axis (Multiple)</label>
                                <select
                                  multiple
                                  value={selectedYAxes}
                                  onChange={(e) =>
                                  setSelectedYAxes(Array.from(e.target.selectedOptions, (option) => option.value))
                                  }
                                  className="w-full h-32 bg-slate-800 border border-slate-700 rounded-lg p-2 text-white overflow-y-scroll"
                                >
                                  {columns.map((column) => (
                                    <option key={column} value={column}>{column}</option>
                                  ))}
                                </select>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {activeTab === 'sheets' && (
                <div className="space-y-6">
                  <SheetSelector
                    sheets={sheets}
                    selectedSheetIds={selectedSheetIds}
                    onSelectSheet={handleSelectSheet}
                  />
                  
                  <div className="flex justify-end">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleUseSelectedSheet}
                      disabled={selectedSheetIds.length !== 1}
                      className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg 
                        ${selectedSheetIds.length === 1
                          ? 'bg-teal-600 hover:bg-teal-700 text-white'
                          : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                        }
                      `}
                    >
                      Use Selected Sheet
                    </motion.button>
                  </div>
                </div>
              )}
              
              {activeTab === 'join' && (
                <JoinConfigurator
                  selectedSheets={selectedSheets}
                  onJoinComplete={handleJoinComplete}
                />
              )}
              
              {/* Download Buttons (always visible, but conditionally enabled) */}
              <div className="flex flex-wrap justify-end gap-3 mt-6">
                <button
                  onClick={handleDownloadChart}
                  disabled={!isChartDataAvailable}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  isChartDataAvailable
                  ? 'bg-teal-600 hover:bg-teal-700 text-white'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  }`}
                  >
                  <Download size={16} />
                     Chart
                </button>
                <button
                  onClick={handleDownloadCSV}
                  disabled={!isChartDataAvailable}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  isChartDataAvailable
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  }`}
                  >
                  <Download size={16} />
                   CSV
                </button>
                <button
                  onClick={handleDownloadXLSX}
                  disabled={!isChartDataAvailable}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  isChartDataAvailable
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  }`}
                  >
                  <Download size={16} />
                  XLSX
                </button>
                <button
                  onClick={handleExportPDF}
                  disabled={!isChartDataAvailable}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  isChartDataAvailable
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  }`}
                  >
                  <Download size={16} />
                  PDF
                </button>
              </div>
            </div>
            
            <div className="mt-8 bg-slate-800/50 rounded-lg p-6 overflow-x-auto">
              {chartData.length > 0 ? (
                <div ref={chartRef}>
                  {renderChart()}
                </div>
              ) : (
                <div className="text-center text-slate-400 py-12">
                  {sheets.length === 0 
                    ? "Upload an Excel file to visualize your data"
                    : dataSelectionComplete 
                      ? "Configure your chart above to visualize data"
                      : "Select a sheet or join multiple sheets to visualize data"
                  }
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-900/70 rounded-xl p-6 border border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Recent Activity</h2>
              <button className="text-teal-400 hover:text-teal-300 transition-colors text-sm">
                View All
              </button>
            </div>
            
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <ActivityItem key={item} />
              ))}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardPage;