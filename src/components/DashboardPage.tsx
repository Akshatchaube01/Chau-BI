// import React from 'react';
// import { motion } from 'framer-motion';
// import { ArrowLeft, BarChart, PieChart, LineChart, Users, Activity, TrendingUp } from 'lucide-react';
// import { Link } from 'react-router-dom';

// const DashboardPage: React.FC = () => {
//   return (
//     <div className="min-h-screen bg-slate-950 text-white">
//       {/* Header */}
//       <header className="bg-indigo-950 p-4 shadow-md">
//         <div className="container mx-auto flex justify-between items-center">
//           <Link to="/" className="text-white hover:text-teal-400 transition-colors flex items-center gap-2">
//             <ArrowLeft size={20} />
//             <span>Back to Home</span>
//           </Link>
//           <div className="flex items-center gap-4">
//             <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-indigo-500 flex items-center justify-center">
//               <span className="font-bold">AC</span>
//             </div>
//           </div>
//         </div>
//       </header>
      
//       {/* Main Content */}
//       <main className="container mx-auto p-4 mt-8">
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <h1 className="text-3xl font-bold mb-8">Analytics Dashboard</h1>
          
//           {/* Dashboard Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//             {/* Stat Cards */}
//             <StatCard 
//               title="Users" 
//               value="14,856" 
//               change="+12.5%" 
//               icon={<Users size={24} className="text-teal-400" />} 
//             />
//             <StatCard 
//               title="Active Sessions" 
//               value="2,485" 
//               change="+8.2%" 
//               icon={<Activity size={24} className="text-indigo-400" />} 
//             />
//             <StatCard 
//               title="Conversion Rate" 
//               value="3.8%" 
//               change="+0.6%" 
//               icon={<TrendingUp size={24} className="text-purple-400" />} 
//             />
//           </div>
          
//           {/* Charts */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
//             <ChartCard 
//               title="User Growth" 
//               description="Last 6 months" 
//               icon={<LineChart size={20} className="text-teal-400" />} 
//             />
//             <ChartCard 
//               title="Traffic Sources" 
//               description="Current month" 
//               icon={<PieChart size={20} className="text-indigo-400" />} 
//             />
//           </div>
          
//           {/* Recent Activity */}
//           <div className="bg-slate-900/70 rounded-xl p-6 border border-slate-800">
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-semibold">Recent Activity</h2>
//               <button className="text-teal-400 hover:text-teal-300 transition-colors text-sm">
//                 View All
//               </button>
//             </div>
            
//             <div className="space-y-4">
//               {[1, 2, 3, 4].map((item) => (
//                 <ActivityItem key={item} />
//               ))}
//             </div>
//           </div>
//         </motion.div>
//       </main>
//     </div>
//   );
// };

// const StatCard: React.FC<{
//   title: string;
//   value: string;
//   change: string;
//   icon: React.ReactNode;
// }> = ({ title, value, change, icon }) => {
//   return (
//     <motion.div 
//       className="bg-slate-900/70 rounded-xl p-6 border border-slate-800 hover:border-indigo-800/50 transition-all duration-300"
//       whileHover={{ y: -5, transition: { duration: 0.2 } }}
//     >
//       <div className="flex justify-between items-start mb-4">
//         <div>
//           <h3 className="text-slate-400 text-sm mb-1">{title}</h3>
//           <p className="text-3xl font-bold">{value}</p>
//         </div>
//         <div className="p-3 bg-slate-800/50 rounded-lg">
//           {icon}
//         </div>
//       </div>
//       <div className="flex items-center">
//         <span className="text-emerald-500 text-sm">{change}</span>
//         <span className="text-slate-400 text-sm ml-2">vs last period</span>
//       </div>
//     </motion.div>
//   );
// };

// const ChartCard: React.FC<{
//   title: string;
//   description: string;
//   icon: React.ReactNode;
// }> = ({ title, description, icon }) => {
//   return (
//     <div className="bg-slate-900/70 rounded-xl p-6 border border-slate-800">
//       <div className="flex justify-between items-center mb-4">
//         <div>
//           <h3 className="font-semibold mb-1">{title}</h3>
//           <p className="text-slate-400 text-sm">{description}</p>
//         </div>
//         <div className="p-2 bg-slate-800/50 rounded-lg">
//           {icon}
//         </div>
//       </div>
      
//       {/* Placeholder for chart */}
//       <div className="mt-4 h-48 bg-slate-800/50 rounded-lg flex items-center justify-center">
//         <div className="text-slate-500 text-sm">Chart Visualization</div>
//       </div>
//     </div>
//   );
// };

// const ActivityItem: React.FC = () => {
//   const activities = [
//     'New user registered',
//     'Completed onboarding',
//     'Created new dashboard',
//     'Generated report'
//   ];
  
//   const randomActivity = activities[Math.floor(Math.random() * activities.length)];
//   const randomTime = Math.floor(Math.random() * 59) + 1;
  
//   return (
//     <div className="flex items-center py-3 border-b border-slate-800 last:border-0">
//       <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500/30 to-teal-500/30 flex items-center justify-center mr-4">
//         <span className="text-xs">U{Math.floor(Math.random() * 99) + 1}</span>
//       </div>
//       <div className="flex-1">
//         <p className="text-sm">{randomActivity}</p>
//         <p className="text-xs text-slate-500">{randomTime} minutes ago</p>
//       </div>
//       <button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
//         View
//       </button>
//     </div>
//   );
// };

// export default DashboardPage;
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BarChart, PieChart, LineChart, Users, Activity, TrendingUp, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { read, utils } from 'xlsx';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart as RechartsBarChart, Bar, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

interface ChartData {
  [key: string]: string | number;
}

const DashboardPage: React.FC = () => {
  const [chartType, setChartType] = useState<'line' | 'bar' | 'pie'>('line');
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedXAxis, setSelectedXAxis] = useState<string>('');
  const [selectedYAxis, setSelectedYAxis] = useState<string>('');

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (!e.target?.result) return;
      
      try {
        const data = new Uint8Array(e.target.result as ArrayBuffer);
        const workbook = read(data, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = utils.sheet_to_json<ChartData>(worksheet);
        
        if (jsonData.length > 0) {
          setColumns(Object.keys(jsonData[0]));
          setChartData(jsonData);
          setSelectedXAxis(Object.keys(jsonData[0])[0]);
          setSelectedYAxis(Object.keys(jsonData[0])[1]);
        }
      } catch (error) {
        console.error('Error processing file:', error);
        // You might want to show an error message to the user here
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const renderChart = () => {
    if (!chartData.length) return null;

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    switch (chartType) {
      case 'line':
        return (
          <RechartsLineChart width={600} height={300} data={chartData} className="mx-auto">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={selectedXAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={selectedYAxis} stroke="#8884d8" />
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
            <Bar dataKey={selectedYAxis} fill="#8884d8" />
          </RechartsBarChart>
        );
      case 'pie':
        return (
          <RechartsPieChart width={400} height={300} className="mx-auto">
            <Pie
              data={chartData}
              cx={200}
              cy={150}
              labelLine={false}
              nameKey={selectedXAxis}
              dataKey={selectedYAxis}
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

          <div className="bg-slate-900/70 rounded-xl p-6 border border-slate-800 mb-8">
            <div className="flex flex-col md:flex-row gap-6 mb-6">
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-4">Chart Configuration</h2>
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
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Y Axis</label>
                        <select
                          value={selectedYAxis}
                          onChange={(e) => setSelectedYAxis(e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white"
                        >
                          {columns.map((column) => (
                            <option key={column} value={column}>{column}</option>
                          ))}
                        </select>
                      </div>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex-1">
                <h2 className="text-xl font-semibold mb-4">Import Data</h2>
                <div className="border-2 border-dashed border-slate-700 rounded-lg p-8 text-center">
                  <Upload size={32} className="mx-auto mb-4 text-slate-400" />
                  <p className="text-slate-300 mb-4">Upload your Excel file</p>
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
              </div>
            </div>

            <div className="mt-8 bg-slate-800/50 rounded-lg p-6 overflow-x-auto">
              {chartData.length > 0 ? (
                renderChart()
              ) : (
                <div className="text-center text-slate-400 py-12">
                  Upload an Excel file to visualize your data
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

const StatCard: React.FC<{
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}> = ({ title, value, change, icon }) => {
  return (
    <motion.div 
      className="bg-slate-900/70 rounded-xl p-6 border border-slate-800 hover:border-indigo-800/50 transition-all duration-300"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-slate-400 text-sm mb-1">{title}</h3>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="p-3 bg-slate-800/50 rounded-lg">
          {icon}
        </div>
      </div>
      <div className="flex items-center">
        <span className="text-emerald-500 text-sm">{change}</span>
        <span className="text-slate-400 text-sm ml-2">vs last period</span>
      </div>
    </motion.div>
  );
};

const ActivityItem: React.FC = () => {
  const activities = [
    'New user registered',
    'Completed onboarding',
    'Created new dashboard',
    'Generated report'
  ];
  
  const randomActivity = activities[Math.floor(Math.random() * activities.length)];
  const randomTime = Math.floor(Math.random() * 59) + 1;
  
  return (
    <div className="flex items-center py-3 border-b border-slate-800 last:border-0">
      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500/30 to-teal-500/30 flex items-center justify-center mr-4">
        <span className="text-xs">U{Math.floor(Math.random() * 99) + 1}</span>
      </div>
      <div className="flex-1">
        <p className="text-sm">{randomActivity}</p>
        <p className="text-xs text-slate-500">{randomTime} minutes ago</p>
      </div>
      <button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
        View
      </button>
    </div>
  );
};

export default DashboardPage;