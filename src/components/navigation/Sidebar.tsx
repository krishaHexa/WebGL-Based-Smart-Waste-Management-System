import React from 'react';
import { 
  BarChart3, 
  Truck, 
  Trash2, 
  Building2, 
  AlertTriangle, 
  LayoutDashboard, 
  Camera, 
  Settings, 
  FileText, 
  ChevronLeft,
  ChevronRight,
  Activity,
  UserCheck,
  Package,
  Layers,
  Zap
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useUIStore } from '../../store/uiStore';
import { useIncidentStore } from '../../store/incidentStore';
import { useSettingsStore } from '../../store/settingsStore';
import { useAuthStore } from '../../store/authStore';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import BrandLogo from '../shared/BrandLogo';

const Sidebar: React.FC = () => {
  const { isSidebarOpen, toggleSidebar } = useUIStore();
  const { isRTL } = useSettingsStore();
  const { incidents } = useIncidentStore();
  const { user } = useAuthStore();
  const { t } = useTranslation();

  const getNavGroups = () => {
    if (!user) return [];

    switch (user.role) {
      case 'SUPER_ADMIN':
        return [
          {
            title: t('navigation.main', 'Main'),
            items: [
              { icon: LayoutDashboard, label: t('navigation.overview', 'Overview'), path: '/admin-dashboard' },
              { icon: Activity, label: t('navigation.simulation', 'Simulation'), path: '/simulation' },
            ]
          },
          {
            title: t('navigation.operations', 'Operations'),
            items: [
              { icon: Zap, label: 'Dispatch Center', path: '/dispatch-dashboard' },
              { icon: Truck, label: t('navigation.routes', 'Routes'), path: '/fleet' },
              { icon: Package, label: t('navigation.assets', 'Assets'), path: '/bins' },
              { icon: Building2, label: t('navigation.facilities', 'Facilities'), path: '/facilities' },
              { icon: AlertTriangle, label: t('navigation.incidents', 'Incidents'), path: '/incidents', hasBadge: true },
              { icon: Camera, label: t('navigation.cctv', 'CCTV Wall'), path: '/cctv-wall' },
            ]
          },
          {
            title: t('navigation.insights', 'Insights'),
            items: [
              { icon: BarChart3, label: t('navigation.analytics', 'Analytics'), path: '/analytics' },
              { icon: FileText, label: t('navigation.reports', 'Reports'), path: '/reports' },
            ]
          },
          {
            title: t('navigation.system', 'System'),
            items: [
              { icon: Settings, label: t('navigation.admin', 'Admin'), path: '/admin' },
            ]
          }
        ];

      case 'FACILITY_MANAGER':
        return [
          {
            title: t('navigation.main', 'Dashboard'),
            items: [
              { icon: LayoutDashboard, label: 'Facility Hub', path: '/facility-dashboard' },
            ]
          },
          {
            title: t('navigation.operations', 'Operations'),
            items: [
              { icon: Building2, label: t('navigation.facilities', 'My Facility'), path: '/facilities' },
              { icon: UserCheck, label: 'Workforce', path: '/facility-workforce' },
              { icon: AlertTriangle, label: 'Alerts', path: '/facility-incidents', hasBadge: true },
            ]
          },
          {
            title: 'Reporting',
            items: [
              { icon: BarChart3, label: 'Performance', path: '/facility-analytics' },
              { icon: FileText, label: 'Day Logs', path: '/reports' },
            ]
          }
        ];

      case 'FLEET_MANAGER':
        return [
          {
            title: t('navigation.main', 'Operations'),
            items: [
              { icon: LayoutDashboard, label: 'Fleet Dashboard', path: '/fleet-dashboard' },
              { icon: AlertTriangle, label: 'Operational Alerts', path: '/incidents', hasBadge: true },
            ]
          },
          {
            title: t('navigation.insights', 'Insights'),
            items: [
              { icon: BarChart3, label: 'Analytics Hub', path: '/analytics' },
              { icon: FileText, label: t('navigation.reports', 'Reports'), path: '/reports' },
            ]
          }
        ];

      case 'CCTV_OPERATOR':
        return [
          {
            title: 'Surveillance',
            items: [
              { icon: Camera, label: 'Control Center', path: '/cctv-dashboard' },
              { icon: Layers, label: 'Map View', path: '/admin-dashboard' },
            ]
          },
          {
            title: 'Response',
            items: [
              { icon: AlertTriangle, label: 'Incidents', path: '/incidents', hasBadge: true },
            ]
          }
        ];

      case 'DISPATCH_OPERATOR':
      case 'FLEET_SUPERVISOR':
        return [
          {
            title: 'Control Center',
            items: [
              { icon: Zap, label: 'Dispatch Board', path: '/dispatch-dashboard' },
              { icon: LayoutDashboard, label: 'Fleet Overview', path: '/fleet-dashboard' },
            ]
          },
          {
            title: 'Logistics',
            items: [
              { icon: Truck, label: 'Routes Control', path: '/fleet-routes' },
              { icon: AlertTriangle, label: 'Alerts', path: '/incidents', hasBadge: true },
            ]
          }
        ];

      default:
        return [];
    }
  };

  const navGroups = getNavGroups();

  const activeIncidentCount = incidents.filter(i => i.status !== 'resolved').length;

  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[45] lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside 
        dir={isRTL ? "rtl" : "ltr"}
        className={cn(
          "fixed inset-y-0 left-0 lg:relative flex flex-col h-full bg-white transition-all duration-300 ease-in-out z-50 shadow-sm",
          "border-r border-slate-200",
          isSidebarOpen ? "w-64 translate-x-0" : "w-20 -translate-x-full lg:translate-x-0",
          isRTL && (isSidebarOpen ? "right-0 left-auto translate-x-0" : "right-0 left-auto translate-x-full lg:translate-x-0")
        )}
      >
        {/* Brand Header & Toggle */}
        <div className="flex items-center justify-between h-20 px-5 bg-white relative border-b border-slate-100">
          {(isSidebarOpen || !isSidebarOpen) && (
            <div className="flex items-center gap-3 overflow-hidden">
               {isSidebarOpen ? (
                 <>
                   <BrandLogo size="md" theme="dark" />
                   <div className="flex flex-col leading-none">
                      <span className="text-[13px] font-black tracking-tight text-slate-950 whitespace-nowrap uppercase">KSA Smart Waste</span>
                      <span className="text-[9px] font-bold text-blue-600 uppercase tracking-tighter mt-1 leading-none">Management Platform</span>
                   </div>
                 </>
               ) : (
                 <div className="mx-auto hidden lg:block">
                   <BrandLogo size="sm" theme="dark" />
                 </div>
               )}
            </div>
          )}

          {/* Toggle Button - Hidden on mobile, handled by Topbar */}
          <button 
            onClick={toggleSidebar}
            className={cn(
              "absolute -right-3 top-7 w-6 h-6 bg-white border border-slate-200 rounded-full hidden lg:flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-100 shadow-sm transition-all z-[60]",
              !isSidebarOpen && "rotate-180"
            )}
          >
            <ChevronLeft size={14} />
          </button>
          
          {/* Mobile Close Button */}
          <button 
            onClick={toggleSidebar}
            className="lg:hidden p-2 text-slate-400 hover:text-slate-900 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
        </div>

      <nav className="flex-1 overflow-y-auto no-scrollbar py-6">
        <div className="px-4 space-y-8">
          {navGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-2">
              {isSidebarOpen && (
                <h3 className={cn(
                  "px-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]",
                  isRTL && "text-right"
                )}>
                  {group.title}
                </h3>
              )}
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) => cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all group relative",
                        isActive 
                         ? "bg-blue-50 text-blue-600 border border-blue-100" 
                         : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                      )}
                    >
                      <item.icon size={18} className={cn("shrink-0", !isSidebarOpen && "mx-auto")} />
                      
                      {isSidebarOpen && (
                        <div className="flex items-center justify-between flex-1 overflow-hidden">
                           <span className="text-[13px] font-bold truncate">{item.label}</span>
                           {item.hasBadge && activeIncidentCount > 0 && (
                             <span className={cn(
                               "text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-md font-black",
                               "shadow-sm"
                             )}>
                               {activeIncidentCount}
                             </span>
                           )}
                        </div>
                      )}

                      {!isSidebarOpen && (
                        <>
                          {item.hasBadge && activeIncidentCount > 0 && (
                            <div className="absolute top-2 right-4 w-2 h-2 bg-red-500 rounded-full border border-white" />
                          )}
                          <div className={cn(
                            "absolute hidden group-hover:block bg-slate-900 text-white text-[11px] px-3 py-2 rounded-lg shadow-xl whitespace-nowrap z-50 font-bold left-full ml-4",
                            isRTL && "left-auto right-full mr-4"
                          )}>
                            {item.label}
                          </div>
                        </>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </nav>

      {/* User Info Footer */}
      <div className="p-4 bg-white border-t border-slate-100 font-sans">
        <div className={cn("flex items-center gap-3", !isSidebarOpen && "justify-center")}>
          <div className="w-10 h-10 rounded-xl bg-slate-50 shadow-sm border border-slate-100 flex-shrink-0 flex items-center justify-center">
            {user?.avatar ? (
              <img src={user.avatar} className="w-full h-full rounded-xl object-cover" alt="" />
            ) : (
              <UserCheck size={18} className="text-blue-600" />
            )}
          </div>
          {isSidebarOpen && (
            <div className={cn("flex flex-col min-w-0")}>
              <span className="text-[12px] font-black text-slate-900 truncate">{user?.name || 'Ahmed Hassan'}</span>
              <span className="text-[10px] text-blue-600 font-black uppercase tracking-widest truncate">{user?.role.replace('_', ' ') || 'Operator'}</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  </>
);
};

export default Sidebar;
