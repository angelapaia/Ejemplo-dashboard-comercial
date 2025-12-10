import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FilterBar } from '../components/FilterBar';
import {
    BarChart2,
    Users,
    Funnel,
    Target,
    Phone,
    Clock,
    MapPin,
    Activity,
    FileWarning,
    Settings,
    MonitorPlay
} from 'lucide-react';

export const DashboardLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
    const location = useLocation();
    const isActive = (path: string) => location.pathname === path;

    const menuItems = [
        { path: '/dashboard/summary', label: 'Resumen Ejecutivo', icon: <BarChart2 size={18} /> },
        { path: '/dashboard/funnel', label: 'Embudo Comercial', icon: <Funnel size={18} /> },
        { path: '/dashboard/commercials', label: 'Rendimiento Comercial', icon: <Users size={18} /> },
        { path: '/dashboard/marketing', label: 'Marketing & Atribución', icon: <Target size={18} /> },
        { path: '/dashboard/products', label: 'Soluciones / Productos', icon: <Settings size={18} /> },
        { path: '/dashboard/activity', label: 'Actividad (Llamadas)', icon: <Phone size={18} /> },
        { path: '/dashboard/time', label: 'Tiempo & Velocidad', icon: <Clock size={18} /> },
        { path: '/dashboard/quality', label: 'Calidad & Perdidos', icon: <FileWarning size={18} /> },
        { path: '/dashboard/geo', label: 'Geografía', icon: <MapPin size={18} /> },
        { path: '/dashboard/experimental', label: 'Experimentos', icon: <Activity size={18} /> },
    ];

    return (
        <div className="min-h-screen flex bg-[#0f172a] text-white">
            {/* Sidebar */}
            <aside className="w-64 border-r border-white/5 bg-slate-900/50 flex flex-col fixed h-full z-10 glass-panel border-y-0 border-l-0 rounded-none">
                <div className="p-6">
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-sky-400 to-purple-400">
                        BI Dashboard
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">Intelligence Suite v2.0</p>
                </div>

                <nav className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${isActive(item.path)
                                    ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-white/5">
                    <Link to="/tv" className="flex items-center gap-3 px-3 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 transition-all">
                        <MonitorPlay size={18} />
                        Modo TV (Arena)
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 ml-64 min-h-screen flex flex-col">
                <FilterBar />
                <div className="flex-1 p-6 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};
