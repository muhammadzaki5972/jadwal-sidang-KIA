import React, { useEffect, useState } from 'react';
import { Users, UserCog, CalendarDays, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../services/api';

const DashboardPage = () => {
  const [statsData, setStatsData] = useState({ pemohon: 0, termohon: 0, jadwal: 0 });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [pemohonRes, termohonRes, jadwalRes] = await Promise.all([
          api.get('/pemohon'),
          api.get('/termohon'),
          api.get('/jadwal')
        ]);
        
        setStatsData({
          pemohon: pemohonRes.data.length,
          termohon: termohonRes.data.length,
          jadwal: jadwalRes.data.length
        });

        // Process data for chart
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'];
        const monthlyData = new Array(12).fill(0);
        
        jadwalRes.data.forEach(item => {
          if (item.tanggal) {
            const date = new Date(item.tanggal);
            const month = date.getMonth();
            monthlyData[month]++;
          }
        });
        
        const formattedChartData = months.map((month, index) => ({
          name: month,
          jumlah: monthlyData[index]
        }));
        
        setChartData(formattedChartData);
        
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-base-content">Dashboard</h1>
        <p className="text-base-content/60 mt-2">Ringkasan data Sistem Manajemen Jadwal Sidang PSI</p>
      </div>

      <div className="stats stats-vertical lg:stats-horizontal shadow-xl w-full bg-base-100">
        <div className="stat">
          <div className="stat-figure text-primary">
            <CalendarDays size={32} />
          </div>
          <div className="stat-title font-semibold">Total Jadwal Sidang</div>
          <div className="stat-value text-primary">{loading ? <span className="loading loading-spinner"></span> : statsData.jadwal}</div>
          <div className="stat-desc">Sidang tercatat dalam sistem</div>
        </div>
        
        <div className="stat">
          <div className="stat-figure text-secondary">
            <Users size={32} />
          </div>
          <div className="stat-title font-semibold">Total Pemohon</div>
          <div className="stat-value text-secondary">{loading ? <span className="loading loading-spinner"></span> : statsData.pemohon}</div>
          <div className="stat-desc">Individu atau Badan terdaftar</div>
        </div>
        
        <div className="stat">
          <div className="stat-figure text-accent">
            <UserCog size={32} />
          </div>
          <div className="stat-title font-semibold">Total Termohon</div>
          <div className="stat-value text-accent">{loading ? <span className="loading loading-spinner"></span> : statsData.termohon}</div>
          <div className="stat-desc">Badan Publik terdaftar</div>
        </div>
      </div>

      <div className="card bg-base-100 shadow-xl border border-base-200">
        <div className="card-body">
          <h2 className="card-title flex items-center gap-2 mb-4 text-base-content">
            <TrendingUp size={24} className="text-primary" />
            Grafik Persidangan
          </h2>
          <div className="h-72 w-full mt-2">
            {loading ? (
              <div className="h-full flex items-center justify-center bg-base-200/50 rounded-box border-2 border-dashed border-base-300">
                <span className="loading loading-spinner text-primary loading-lg"></span>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 30, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 12}} allowDecimals={false} />
                  <Tooltip 
                    cursor={{fill: '#f3f4f6'}} 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                  />
                  <Bar dataKey="jumlah" name="Jumlah Sidang" fill="#4f46e5" radius={[4, 4, 0, 0]} maxBarSize={50} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
