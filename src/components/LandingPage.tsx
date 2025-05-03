import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LineChart, BarChart, PieChart, ArrowRight } from 'lucide-react';
import Navbar from './Navbar';
import BackgroundAnimation from './BackgroundAnimation';

const LandingPage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-indigo-950 to-slate-900 overflow-hidden">
      <BackgroundAnimation />
      
      <div className="relative z-10">
        <Navbar />
        <main className="container mx-auto px-4 min-h-screen">
           <div className="min-h-screen flex flex-col justify-start items-center text-center pt-40">

            <motion.div 
              className="text-center "
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <motion.h1 
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-indigo-400">
                  Chau-BI
                </span>
                <br />
                <span className="text-white">Analytics Reimagined</span>
              </motion.h1>
              <motion.p 
                className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.4 }}
              >
                Transform raw data into actionable insights with our powerful analytics platform.
                Visualize trends, predict outcomes, and make data-driven decisions.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="flex flex-col sm:flex-row justify-center items-center gap-4"
              >
                <Link to="/dashboard">
                  <motion.button 
                    className="px-8 mb-35 py-4 bg-gradient-to-r from-teal-500 to-indigo-500 hover:from-teal-600 hover:to-indigo-600 text-white font-semibold rounded-lg flex items-center gap-2 shadow-lg shadow-indigo-900/30 hover:shadow-indigo-900/50 transition-all duration-300"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Explore Dashboard
                    <ArrowRight size={20} />
                  </motion.button>
                </Link>
                
                <motion.button 
                  className="px-8 py-4 mb-35 border border-white/20 text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Watch Demo
                </motion.button>
              </motion.div>
            </motion.div>
            
            <motion.div 
              className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <FeatureCard 
                icon={<LineChart className="text-teal-400" size={28} />}
                title="Advanced Analytics"
                description="Powerful tools for deep data analysis and pattern recognition."
              />
              <FeatureCard 
                icon={<BarChart className="text-indigo-400" size={28} />}
                title="Visual Reporting"
                description="Beautiful, interactive dashboards for clear data visualization."
              />
              <FeatureCard 
                icon={<PieChart className="text-purple-400" size={28} />}
                title="Predictive Insights"
                description="AI-powered forecasting to predict future trends and outcomes."
              />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <motion.div 
      className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all duration-300"
      whileHover={{ y: -8 }}
    >
      <div className="mb-4 p-3 bg-indigo-950/50 inline-block rounded-lg">
        {icon}
      </div>
      <h3 className="text-white text-xl font-semibold mb-2">{title}</h3>
      <p className="text-slate-300">{description}</p>
    </motion.div>
  );
};

export default LandingPage;