import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { LayoutDashboard, Users, UserCog, CalendarDays, LogOut, Menu, ChevronLeft, ChevronRight } from 'lucide-react';

const AdminLayout = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Data Pemohon', path: '/admin/pemohon', icon: <Users size={20} /> },
    { name: 'Data Termohon', path: '/admin/termohon', icon: <UserCog size={20} /> },
    { name: 'Jadwal Sidang', path: '/admin/jadwal', icon: <CalendarDays size={20} /> },
  ];

  return (
    <div className="drawer lg:drawer-open">
      <input id="admin-drawer" type="checkbox" className="drawer-toggle" />
      
      <div className="drawer-content flex flex-col bg-base-200 min-h-screen transition-all duration-300">
        {/* Navbar */}
        <div className="navbar bg-base-100 shadow-sm sticky top-0 z-30">
          <div className="flex-none lg:hidden">
            <label htmlFor="admin-drawer" aria-label="open sidebar" className="btn btn-square btn-ghost">
              <Menu size={24} />
            </label>
          </div>
          <div className="flex-1 lg:hidden">
            <span className="font-bold text-xl px-2">PSI ADMIN</span>
          </div>
          <div className="flex-1 hidden lg:flex justify-end px-4">
            <div className="flex items-center gap-3">
              <div className="avatar placeholder">
                <div className="bg-primary text-primary-content rounded-full w-10">
                  <span className="font-bold">A</span>
                </div>
              </div>
              <span className="font-semibold text-base-content">Admin KIA</span>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div> 
      
      {/* Sidebar */}
      <div className="drawer-side z-40 shadow-2xl">
        <label htmlFor="admin-drawer" aria-label="close sidebar" className="drawer-overlay"></label> 
        <div className={`flex flex-col min-h-full bg-base-100 border-r border-base-200 transition-all duration-300 ${isExpanded ? 'w-80' : 'w-24'}`}>
          <div className={`p-6 flex items-center border-b border-base-200 h-20 ${isExpanded ? 'justify-between' : 'justify-center'}`}>
            {isExpanded && <h2 className="text-2xl font-black tracking-widest text-primary">PSI<span className="text-base-content">ADMIN</span></h2>}
            <button onClick={() => setIsExpanded(!isExpanded)} className="btn btn-square btn-ghost btn-sm text-base-content/70">
              {isExpanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          </div>
          
          <ul className={`menu menu-lg flex-1 py-6 gap-2 text-base-content ${isExpanded ? 'px-4' : 'px-2 items-center'}`}>
            {navItems.map((item) => (
              <li key={item.name} className={isExpanded ? 'w-full' : ''}>
                <NavLink
                  to={item.path}
                  title={!isExpanded ? item.name : ''}
                  className={({ isActive }) => 
                    `rounded-xl flex items-center ${isExpanded ? 'justify-start gap-4' : 'justify-center w-14 h-14 p-0'} ${isActive ? 'active bg-primary text-primary-content shadow-md font-semibold' : 'hover:bg-base-200 font-medium'}`
                  }
                  onClick={() => {
                    if (window.innerWidth < 1024) document.getElementById('admin-drawer').checked = false;
                  }}
                >
                  {item.icon}
                  {isExpanded && <span>{item.name}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
          
          <div className={`p-4 border-t border-base-200 flex ${isExpanded ? '' : 'justify-center'}`}>
            <button
              onClick={handleLogout}
              title={!isExpanded ? 'Logout' : ''}
              className={`btn btn-ghost text-error rounded-xl hover:bg-error/10 ${isExpanded ? 'w-full justify-start gap-3' : 'btn-square'}`}
            >
              <LogOut size={20} />
              {isExpanded && <span>Logout</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
