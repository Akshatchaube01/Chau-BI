import React from 'react';
import { motion } from 'framer-motion';

// Generate random particles
const generateParticles = (count: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 10 + 2,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));
};

const particles = generateParticles(30);
const gridLines = Array.from({ length: 10 }, (_, i) => i);

const BackgroundAnimation: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Grid lines */}
      <div className="absolute inset-0 opacity-20">
        {gridLines.map((line) => (
          <React.Fragment key={`h-${line}`}>
            <div 
              className="absolute h-px bg-indigo-500/20" 
              style={{ left: 0, right: 0, top: `${line * 10}%` }}
            />
            <div 
              className="absolute w-px bg-indigo-500/20" 
              style={{ top: 0, bottom: 0, left: `${line * 10}%` }}
            />
          </React.Fragment>
        ))}
      </div>
      
      {/* Moving particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-gradient-to-r from-indigo-500/20 to-teal-500/20 backdrop-blur-sm"
          initial={{ 
            x: `${particle.x}%`, 
            y: `${particle.y}%`,
            opacity: 0.1,
            scale: 0.8
          }}
          animate={{ 
            x: [`${particle.x}%`, `${(particle.x + 30) % 100}%`, `${(particle.x + 10) % 100}%`],
            y: [`${particle.y}%`, `${(particle.y + 20) % 100}%`, `${(particle.y - 20 + 100) % 100}%`],
            opacity: [0.1, 0.3, 0.1],
            scale: [0.8, 1.2, 0.8]
          }}
          transition={{ 
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{ 
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
        />
      ))}
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-indigo-950/70" />
      
      {/* Data visualization elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 opacity-30">
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2 }}
        >
          {Array.from({ length: 40 }, (_, i) => (
            <motion.div
              key={i}
              className="absolute bottom-0 w-2 bg-gradient-to-t from-teal-400 to-teal-400/0 rounded-t-sm"
              initial={{ height: 0 }}
              animate={{ height: `${Math.random() * 100}%` }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                repeatType: "reverse",
                delay: i * 0.1
              }}
              style={{ left: `${(i * 2.5) + 2}%` }}
            />
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default BackgroundAnimation;