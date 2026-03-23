import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const REGIONS = {
  heart: { x: 100, y: 140, zoom: 3, label: "Cardiac Region" },
  lungs: { x: 100, y: 130, zoom: 2.5, label: "Respiratory System" },
  body: { x: 100, y: 200, zoom: 1.5, label: "Systemic Overview" },
  none: { x: 100, y: 200, zoom: 1, label: "Full Body Scan" }
};

export default function DigitalTwin({ scanData, isScanning }) {
  const activeRegion = scanData?.affected_regions?.[0] || 'none';
  const regionConfig = REGIONS[activeRegion] || REGIONS.none;
  const severityColor = scanData?.heatmap_colour || 'green';

  return (
    <div className="digital-twin-wrapper">
      <AnimatePresence>
        {isScanning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="digital-twin-overlay"
          >
            <div className="scanning-container">
              <motion.div 
                className="scan-bar"
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <p className="scan-status text-cyan-400 font-bold tracking-widest uppercase">
                Synchronizing Digital Twin...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="viewport">
        <motion.div 
          className="body-canvas"
          animate={{
            scale: regionConfig.zoom,
            x: (100 - regionConfig.x) * regionConfig.zoom,
            y: (200 - regionConfig.y) * regionConfig.zoom,
          }}
          transition={{ type: 'spring', damping: 20, stiffness: 80 }}
        >
          {/* Simple Human Silhouette SVG */}
          <svg width="200" height="400" viewBox="0 0 200 400" className="human-svg">
            <path 
              d="M100,20 C110,20 120,30 120,45 C120,60 110,70 100,70 C90,70 80,60 80,45 C80,30 90,20 100,20 M85,75 L115,75 L130,150 L120,150 L115,90 L115,220 L130,380 L110,380 L100,250 L90,380 L70,380 L85,220 L85,90 L80,150 L70,150 Z" 
              fill="#1e293b" 
              stroke="#38bdf8" 
              strokeWidth="1"
            />
            
            {/* Glowing anomaly circle */}
            {activeRegion !== 'none' && !isScanning && (
              <motion.circle
                cx={regionConfig.x}
                cy={regionConfig.y}
                r="15"
                fill="none"
                stroke={severityColor}
                strokeWidth="2"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: [1, 1.2, 1], opacity: 1 }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              />
            )}
          </svg>

          {/* Leader Line and Label */}
          {activeRegion !== 'none' && !isScanning && (
            <AnimatePresence>
              <motion.div 
                className="diagnostic-pointer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="leader-line" style={{ backgroundColor: severityColor }} />
                <div className="glass-label" style={{ borderLeftColor: severityColor }}>
                  <h4 className="text-sm font-bold uppercase tracking-tight" style={{ color: severityColor }}>
                    {scanData.ui_label || "Anomaly Detected"}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    {scanData.consensus}
                  </p>
                  <div className="mt-2 flex gap-1">
                    {scanData.lstm_result?.patterns?.slice(0, 2).map(p => (
                      <span key={p} className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-400">
                        {p.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          )}
        </motion.div>
      </div>
    </div>
  );
}
