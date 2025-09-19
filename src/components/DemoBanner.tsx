import React from 'react';
import { motion } from 'framer-motion';
import { Beaker, X } from 'lucide-react';

interface DemoBannerProps {
  onExitDemo: () => void;
}

const DemoBanner: React.FC<DemoBannerProps> = ({ onExitDemo }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-3 shadow-lg relative"
    >
      <div className="flex items-center justify-center space-x-3">
        <Beaker className="w-5 h-5" />
        <span className="font-semibold">Demo Mode Active</span>
        <span className="hidden sm:inline">- Explore all features with sample data</span>
        <button
          onClick={onExitDemo}
          className="ml-4 p-1 hover:bg-white/20 rounded transition-colors"
          title="Exit Demo Mode"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default DemoBanner;
