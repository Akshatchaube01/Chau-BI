import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon }) => {
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

export default StatCard;