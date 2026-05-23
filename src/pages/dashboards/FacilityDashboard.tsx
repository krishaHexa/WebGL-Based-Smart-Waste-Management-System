import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, 
  Activity, 
  Settings, 
  Truck, 
  Wind, 
  Wrench, 
  BarChart3,
  Factory,
  Boxes
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { cn } from '../../lib/utils';

// Import Views (to be created)
import FacilityOverviewView from '../../components/features/facilities/FacilityOverviewView';
import WasteProcessingView from '../../components/features/facilities/WasteProcessingView';
import MachineryMonitoringView from '../../components/features/facilities/MachineryMonitoringView';
import TruckIntakeView from '../../components/features/facilities/TruckIntakeView';
import EnvironmentalMonitoringView from '../../components/features/facilities/EnvironmentalMonitoringView';
import FacilityMaintenanceView from '../../components/features/facilities/FacilityMaintenanceView';
import FacilityReportsView from '../../components/features/facilities/FacilityReportsView';

type FacilityTab = 'overview' | 'processing' | 'machinery' | 'trucks' | 'environmental' | 'maintenance' | 'reports';

const FacilityDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<FacilityTab>('overview');

  const tabs = [
    { id: 'overview', label: 'Facility Overview', icon: Building2 },
    { id: 'processing', label: 'Waste Processing', icon: Factory },
    { id: 'machinery', label: 'Machinery & Equipment', icon: Settings },
    { id: 'trucks', label: 'Truck Intake', icon: Truck },
    { id: 'environmental', label: 'Environmental Monitoring', icon: Wind },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview': return <FacilityOverviewView />;
      case 'processing': return <WasteProcessingView />;
      case 'machinery': return <MachineryMonitoringView />;
      case 'trucks': return <TruckIntakeView />;
      case 'environmental': return <EnvironmentalMonitoringView />;
      case 'maintenance': return <FacilityMaintenanceView />;
      case 'reports': return <FacilityReportsView />;
      default: return <FacilityOverviewView />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50 overflow-hidden">
      {/* Tab Navigation Bar */}
      <div className="bg-white border-b border-slate-100 flex-shrink-0 px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-8 h-full">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as FacilityTab)}
                  className={cn(
                    "h-full flex items-center gap-2.5 px-1 border-b-2 transition-all relative",
                    isActive 
                      ? "border-blue-600 text-blue-600" 
                      : "border-transparent text-slate-400 hover:text-slate-600"
                  )}
                >
                  <Icon size={16} className={cn(isActive ? "text-blue-600" : "text-slate-400")} />
                  <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
                  {isActive && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                    />
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-4">
             <div className="text-right">
                <p className="text-[10px] font-black text-slate-900 leading-none mb-1">{user?.name}</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest leading-none">Facility Manager</p>
             </div>
             <div className="h-8 w-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                <Building2 size={16} />
             </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FacilityDashboard;
