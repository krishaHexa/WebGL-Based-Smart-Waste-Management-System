import { create } from 'zustand';

export type ReportType = 'executive' | 'fleet' | 'bins' | 'facilities' | 'incidents' | 'environmental';
export type ExportFormat = 'pdf' | 'csv' | 'json';

interface ReportConfig {
  type: ReportType;
  dateRange: { start: string; end: string };
  includeVisuals: boolean;
  granularity: 'hourly' | 'daily' | 'weekly';
}

interface ReportStore {
  isGenerating: boolean;
  lastGeneratedReport: any | null;
  config: ReportConfig;
  
  setConfig: (config: Partial<ReportConfig>) => void;
  generateReport: () => Promise<void>;
  exportReport: (format: ExportFormat) => void;
}

export const useReportStore = create<ReportStore>((set, get) => ({
  isGenerating: false,
  lastGeneratedReport: null,
  config: {
    type: 'executive',
    dateRange: { 
      start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), 
      end: new Date().toISOString() 
    },
    includeVisuals: true,
    granularity: 'daily'
  },

  setConfig: (config) => set((state) => ({ 
    config: { ...state.config, ...config } 
  })),

  generateReport: async () => {
    set({ isGenerating: true });
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const { type } = get().config;
    let summary: any = {};
    let datasets: any[] = [];
    let insights: string[] = [];

    switch(type) {
      case 'fleet':
        summary = {
          utilizationRate: '88.4%',
          fuelSaved: '1,240L',
          activeVehicles: 42,
          avgRouteEfficiency: '92%'
        };
        datasets = [
          { name: 'Vehicle Idle Time', value: '12.4 hrs/day' },
          { name: 'Route Deviations', value: '4 total' },
          { name: 'On-time Pickup', value: '96.8%' }
        ];
        insights = [
          "Fuel consumption decreased by 4% due to optimized route deployments.",
          "High idle times detected in Sector 4 during peak hours."
        ];
        break;
      case 'incidents':
        summary = {
          totalResolved: 142,
          avgResolutionTime: '42m',
          criticalPending: 3,
          responseAccuracy: '98%'
        };
        datasets = [
          { name: 'Overflow Alerts', value: '64' },
          { name: 'Safety Deviations', value: '12' },
          { name: 'System Errors', value: '2' }
        ];
        insights = [
          "Resolution time reached record low this week.",
          "Majority of critical alerts originate from Industrial Zone clusters."
        ];
        break;
      case 'environmental':
        summary = {
          carbonSavings: '4.2 Tons',
          recyclingRate: '32%',
          landfillDiversion: '12%',
          methaneAvg: '1.8 ppm'
        };
        datasets = [
          { name: 'Emissions Avoided', value: '240kg' },
          { name: 'Solar Energy Used', value: '840 kWh' },
          { name: 'Hazardous Waste', value: '0.4 Tons' }
        ];
        insights = [
          "Sustainability metrics align with Saudi Green Initiative targets.",
          "Methane levels remain stable within facility perimeters."
        ];
        break;
      default:
        summary = {
          totalAssets: 1240,
          efficiencyScore: 92,
          unresolvedIncidents: 14,
          sustainabilityRating: 'A-'
        };
        datasets = [
          { name: 'Collection Efficiency', value: '94.2%' },
          { name: 'Avg Bin Fill Time', value: '4.2 days' },
          { name: 'Fleet Runtime', value: '842 hrs' },
          { name: 'Methane Average', value: '2.4 ppm' }
        ];
        insights = [
          "Overall operational performance is consistent.",
          "Resource allocation optimized for current demand."
        ];
    }
    
    const reportData = {
      id: `REP-${Math.floor(Math.random() * 100000)}`,
      timestamp: new Date().toISOString(),
      config: get().config,
      summary,
      datasets,
      insights
    };

    set({ isGenerating: false, lastGeneratedReport: reportData });
  },

  exportReport: (format) => {
    const report = get().lastGeneratedReport;
    if (!report) return;

    // Simulate file download
    console.log(`Exporting report ${report.id} as ${format.toUpperCase()}...`);
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smart_waste_report_${report.id}.${format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}));
