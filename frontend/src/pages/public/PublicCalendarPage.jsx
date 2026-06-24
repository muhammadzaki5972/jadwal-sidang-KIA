import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, MapPin, Phone, Mail } from 'lucide-react';
import {
  format, addMonths, subMonths, addWeeks, subWeeks, addDays, subDays, addYears, subYears,
  startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, startOfWeek, endOfWeek, isWeekend, isToday
} from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import api from '../../services/api';

const PublicCalendarPage = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('month'); // 'year', 'month', 'week', 'day'
  const [schedules, setSchedules] = useState([]);
  const [selectedDaySchedules, setSelectedDaySchedules] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await api.get('/jadwal');
        setSchedules(response.data);
      } catch (error) {
        console.error("Error fetching schedules:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, []);

  const handleNext = () => {
    if (viewMode === 'month') setCurrentDate(addMonths(currentDate, 1));
    else if (viewMode === 'week') setCurrentDate(addWeeks(currentDate, 1));
    else if (viewMode === 'day') {
      let nextDay = addDays(currentDate, 1);
      if (isWeekend(nextDay)) nextDay = addDays(nextDay, nextDay.getDay() === 6 ? 2 : 1);
      setCurrentDate(nextDay);
    }
    else if (viewMode === 'year') setCurrentDate(addYears(currentDate, 1));
  };

  const handlePrev = () => {
    if (viewMode === 'month') setCurrentDate(subMonths(currentDate, 1));
    else if (viewMode === 'week') setCurrentDate(subWeeks(currentDate, 1));
    else if (viewMode === 'day') {
      let prevDay = subDays(currentDate, 1);
      if (isWeekend(prevDay)) prevDay = subDays(prevDay, prevDay.getDay() === 0 ? 2 : 1);
      setCurrentDate(prevDay);
    }
    else if (viewMode === 'year') setCurrentDate(subYears(currentDate, 1));
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  let startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  let endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  if (viewMode === 'week') {
    startDate = startOfWeek(currentDate, { weekStartsOn: 1 });
    endDate = endOfWeek(currentDate, { weekStartsOn: 1 });
  }

  const days = eachDayOfInterval({ start: startDate, end: endDate }).filter(day => !isWeekend(day));
  const weekDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat'];

  const getSchedulesForDay = (day) => {
    return schedules.filter(schedule => isSameDay(new Date(schedule.tanggal), day));
  };

  const handleDayClick = (daySchedules) => {
    if (daySchedules.length > 0) {
      setSelectedDaySchedules(daySchedules);
      setCurrentSlide(0);
      setIsModalOpen(true);
    }
  };

  const getHeaderTitle = () => {
    if (viewMode === 'year') return format(currentDate, 'yyyy', { locale: idLocale });
    if (viewMode === 'month') return format(currentDate, 'MMMM yyyy', { locale: idLocale });
    if (viewMode === 'week') return `Minggu ${format(startDate, 'dd MMM')} - ${format(endDate, 'dd MMM yyyy', { locale: idLocale })}`;
    if (viewMode === 'day') return format(currentDate, 'EEEE, dd MMMM yyyy', { locale: idLocale });
  };

  const currentSchedule = selectedDaySchedules[currentSlide];

  const renderCalendarView = () => {
    if (loading) {
      return (
        <div className="h-64 flex items-center justify-center">
          <span className="loading loading-spinner loading-lg text-primary"></span>
        </div>
      );
    }

    if (viewMode === 'year') {
      const months = Array.from({ length: 12 }, (_, i) => new Date(currentDate.getFullYear(), i, 1));
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 sm:p-8">
          {months.map((month, idx) => {
            const schedulesInMonth = schedules.filter(s => isSameMonth(new Date(s.tanggal), month));
            return (
              <div
                key={idx}
                onClick={() => { setCurrentDate(month); setViewMode('month'); }}
                className="card bg-base-100 hover:bg-base-200 hover:shadow-md cursor-pointer transition-all border border-base-200 shadow-sm"
              >
                <div className="card-body p-6 text-center items-center justify-center">
                  <h3 className="card-title text-base-content font-bold mb-3">{format(month, 'MMMM', { locale: idLocale })}</h3>
                  <div className="badge badge-primary font-semibold py-3 px-4">{schedulesInMonth.length} Sidang</div>
                </div>
              </div>
            );
          })}
        </div>
      );
    }

    if (viewMode === 'day') {
      const daySchedules = getSchedulesForDay(currentDate);
      return (
        <div className="p-4 sm:p-8 space-y-4 min-h-[400px]">
          {daySchedules.length === 0 ? (
            <div className="text-center py-20 text-base-content/50 font-medium border-2 border-dashed border-base-200 rounded-2xl">
              Tidak ada jadwal sidang pada hari ini.
            </div>
          ) : (
            daySchedules.map((schedule, idx) => (
              <div key={idx} className="card bg-base-100 border border-base-200 shadow-sm hover:shadow-md transition-all cursor-pointer" onClick={() => handleDayClick([schedule])}>
                <div className="card-body p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="w-full sm:w-2/3 flex flex-col items-center sm:items-start text-center sm:text-left">
                    <div className="badge badge-ghost font-bold mb-2 py-3 px-4">Pukul: {schedule.waktu?.substring(0, 5)} WIB</div>
                    <h4 className="text-lg font-black text-base-content mb-1">No Reg: {schedule.no_register}</h4>
                    <div className="flex flex-col items-center sm:items-start gap-1 mt-2 w-full">
                      <span className="text-sm font-semibold text-base-content/80 leading-snug">{schedule.pemohon?.nama_pemohon}</span>
                      <span className="text-xs font-bold text-base-content/40 uppercase italic my-1">vs</span>
                      <span className="text-sm font-semibold text-base-content/80 leading-snug">{schedule.termohon?.nama_termohon}</span>
                    </div>
                  </div>
                  <div className="w-full sm:w-auto mt-2 sm:mt-0">
                    <div className="badge badge-warning badge-sm font-bold h-auto py-2 px-4 whitespace-normal text-center w-full sm:w-auto">
                      {schedule.agenda?.nama_agenda}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      );
    }

    // Month & Week View sharing the same grid style
    return (
      <div className="card-body p-4 sm:p-8">
        <div className="grid grid-cols-5 gap-2 sm:gap-4 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center font-bold text-base-content/50 text-xs sm:text-sm py-0.5 uppercase tracking-wider">
              <span className="hidden sm:inline">{day}</span>
              <span className="sm:hidden">{day.substring(0, 3)}</span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-5 gap-2 sm:gap-4">
          {days.map((day, idx) => {
            const daySchedules = getSchedulesForDay(day);
            const hasSchedule = daySchedules.length > 0;
            const isCurrentMonth = viewMode === 'month' ? isSameMonth(day, monthStart) : true;
            const today = isToday(day);

            return (
              <div
                key={idx}
                onClick={() => handleDayClick(daySchedules)}
                className={`
                  min-h-[80px] sm:min-h-[120px] p-2 sm:p-3 rounded-2xl border-2 transition-all duration-300 flex flex-col
                  ${!isCurrentMonth ? 'bg-base-200/50 text-base-content/30 border-transparent' : 'bg-base-100 border-base-200 hover:border-primary/50 hover:shadow-lg cursor-pointer'}
                  ${hasSchedule ? 'ring-2 ring-primary ring-offset-2 ring-offset-base-100 border-primary shadow-sm' : ''}
                  ${today && isCurrentMonth ? 'bg-info/10 border-info border-dashed shadow-inner' : ''}
                `}
              >
                <div className="flex justify-between items-start">
                  <span className={`text-sm sm:text-base font-bold w-7 h-7 sm:w-9 sm:h-9 flex items-center justify-center rounded-full ${hasSchedule ? 'bg-primary text-primary-content shadow-md' : ''}`}>
                    {format(day, 'd')}
                  </span>
                  {hasSchedule && (
                    <span className="w-2.5 h-2.5 bg-error rounded-full animate-pulse shadow-sm"></span>
                  )}
                </div>

                <div className="mt-auto pt-2 flex flex-col gap-1">
                  {hasSchedule && viewMode === 'week' ? (
                    daySchedules.map((s, i) => (
                      <div key={i} className="text-[10px] sm:text-xs bg-primary/10 text-primary font-bold px-2 py-1 rounded-md truncate">
                        {s.waktu} - {s.no_register}
                      </div>
                    ))
                  ) : hasSchedule ? (
                    <div className="badge badge-primary badge-sm sm:badge-md font-semibold shadow-sm w-full">
                      {daySchedules.length} Sidang
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-base-200 font-sans">
      {/* Header Sticky */}
      <div className="navbar bg-base-100/70 backdrop-blur-lg shadow-sm sticky top-0 z-50 px-4 sm:px-8 h-20 border-b border-base-200/50">
        <div className="flex-1 flex items-center gap-4">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/9/90/National_emblem_of_Indonesia_Garuda_Pancasila.svg"
            alt="Garuda Logo"
            className="h-13 w-auto"
          />
          <div className="flex flex-col justify-center">
            <h1 className="text-xl sm:text-2xl font-black text-base-content tracking-tight leading-none">JADWAL PSI KIA</h1>
            <p className="text-xs sm:text-sm text-base-content/60 font-semibold mt-1">Komisi Informasi Aceh</p>
          </div>
        </div>
        <div className="flex-none hidden md:flex items-center gap-6">
          <a href="#jadwal" className="btn btn-ghost font-semibold">Jadwal Sidang</a>
          <a href="#kontak" className="btn btn-ghost font-semibold">Kontak</a>
          <a href="/admin/login" className="btn btn-primary shadow-sm px-6">Admin Login</a>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full flex flex-col gap-10">

        {/* Calendar Section */}
        <div className="card bg-base-100 shadow-2xl border border-base-200 overflow-hidden" id="jadwal">
          {/* Calendar Header with Tabs */}
          <div className="p-4 sm:p-6 bg-primary flex flex-col sm:flex-row justify-between items-center text-primary-content gap-4">
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
              <button onClick={handlePrev} className="btn btn-ghost btn-circle btn-sm text-primary-content hover:bg-white/20">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <h2 className="text-sm sm:text-2xl font-bold capitalize tracking-wide text-center min-w-[200px]">
                {getHeaderTitle()}
              </h2>
              <button onClick={handleNext} className="btn btn-ghost btn-circle btn-sm text-primary-content hover:bg-white/20">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <div className="flex bg-white/20 p-1 rounded-full w-full sm:w-auto overflow-x-auto gap-1 shadow-inner">
              <button className={`btn btn-sm rounded-full border-none flex-1 sm:flex-none transition-all ${viewMode === 'day' ? 'bg-white text-info hover:bg-white/90 shadow-sm' : 'bg-transparent text-white hover:bg-white/10 shadow-none'}`} onClick={() => setViewMode('day')}>Hari</button>
              <button className={`btn btn-sm rounded-full border-none flex-1 sm:flex-none transition-all ${viewMode === 'week' ? 'bg-success text-black hover:bg-white/90 shadow-sm' : 'bg-transparent text-white hover:bg-white/10 shadow-none'}`} onClick={() => setViewMode('week')}>Minggu</button>
              <button className={`btn btn-sm rounded-full border-none flex-1 sm:flex-none transition-all ${viewMode === 'month' ? 'bg-secondary text-white hover:bg-white/90 hover:text-black shadow-sm' : 'bg-transparent text-white hover:bg-white/10 shadow-none'}`} onClick={() => setViewMode('month')}>Bulan</button>
              <button className={`btn btn-sm rounded-full border-none flex-1 sm:flex-none transition-all ${viewMode === 'year' ? 'bg-white text-secondary hover:bg-white/90 shadow-sm' : 'bg-transparent text-white hover:bg-white/10 shadow-none'}`} onClick={() => setViewMode('year')}>Tahun</button>
            </div>
          </div>

          {/* Render Calendar View Mode */}
          {renderCalendarView()}

        </div>

        {/* Contact Info (Below Calendar) */}
        <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-6" id="kontak">
          <div className="card bg-base-100 shadow-xl border border-base-200">
            <div className="card-body">
              <h3 className="card-title text-base-content flex items-center gap-2 mb-2">
                <MapPin className="w-6 h-6 text-primary" /> Lokasi Sidang
              </h3>
              <p className="text-base-content/70 font-medium leading-relaxed">
                Kantor Komisi Informasi Aceh<br />
                Jl. Tgk. Daud Beureueh No. 12<br />
                Banda Aceh, Aceh
              </p>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl border border-base-200">
            <div className="card-body">
              <h3 className="card-title text-base-content flex items-center gap-2 mb-2">
                <Phone className="w-6 h-6 text-success" /> Kontak Layanan
              </h3>
              <ul className="space-y-4 text-base-content/70 font-medium mt-2">
                <li className="flex items-center gap-3">
                  <div className="p-2 bg-base-200 rounded-lg"><Phone className="w-4 h-4 text-base-content" /></div>
                  (0651) 123456
                </li>
                <li className="flex items-center gap-3">
                  <div className="p-2 bg-base-200 rounded-lg"><Mail className="w-4 h-4 text-base-content" /></div>
                  info@kia.acehprov.go.id
                </li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="footer footer-center p-3 bg-sky-100 text-sky-900 rounded mt-auto">
        <aside>
          <p className="mb-2 font-bold text-xs">
            Komisi Informasi Aceh <br />
            Sistem Informasi Penjadwalan Sidang Sengketa
          </p>
          <p className="text-[10px]">
            Copyright © {new Date().getFullYear()} - All right reserved</p>
        </aside>
      </footer>

      {/* DaisyUI Modal Detail Jadwal */}
      <dialog className={`modal ${isModalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box p-0 flex flex-col overflow-hidden max-w-lg md:max-w-[95vw] lg:max-w-max w-11/12 lg:w-fit max-h-[85vh] rounded-2xl shadow-2xl">
          {currentSchedule && (
            <>
              {/* Header Modal - Sticky */}
              <div className="py-3 px-4 bg-primary text-primary-content relative flex-shrink-0">
                <div className="flex flex-col items-center justify-center w-full">
                  <h3 className="text-xl font-black text-center mb-0.5">Detail Jadwal</h3>
                  <p className="text-sm text-primary-content/90 font-medium text-center mb-1">
                    {format(new Date(currentSchedule.tanggal), 'EEEE, dd MMMM yyyy', { locale: idLocale })}
                  </p>
                  <div>
                    <span className="badge badge-sm bg-white text-primary border-none font-bold shadow-sm px-2 py-2.5">Pukul: {currentSchedule.waktu?.substring(0, 5)} WIB</span>
                  </div>
                </div>
                {selectedDaySchedules.length > 1 && (
                  <div className="badge badge-accent font-bold shadow-sm border-2 border-primary absolute top-4 right-4">
                    {currentSlide + 1} / {selectedDaySchedules.length}
                  </div>
                )}
              </div>

              {/* Content Modal - Scrollable */}
              <div className="p-6 space-y-6 bg-base-100 overflow-y-auto flex-1">
                <div className="text-center">
                  <p className="text-xs font-bold text-base-content/50 uppercase tracking-widest mb-1">Nomor Register</p>
                  <p className="text-xl font-black text-base-content">{currentSchedule.no_register}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-base-200 p-4 rounded-xl flex flex-col justify-center text-center">
                    <p className="text-xs font-bold text-base-content/50 uppercase tracking-widest mb-2">Pemohon</p>
                    <p className="font-bold text-base-content md:whitespace-nowrap">{currentSchedule.pemohon?.nama_pemohon}</p>
                  </div>
                  <div className="bg-base-200 p-4 rounded-xl flex flex-col justify-center text-center">
                    <p className="text-xs font-bold text-base-content/50 uppercase tracking-widest mb-2">Termohon</p>
                    <p className="font-bold text-base-content md:whitespace-nowrap">{currentSchedule.termohon?.nama_termohon}</p>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-xs font-bold text-base-content/50 uppercase tracking-widest mb-2">Agenda Sidang</p>
                  <div className="badge badge-primary badge-lg font-bold gap-2 p-4 h-auto text-center whitespace-normal">
                    {currentSchedule.agenda?.nama_agenda}
                  </div>
                </div>

                <div className="border-t border-base-200 pt-6">
                  <p className="text-xs font-bold text-base-content/50 uppercase tracking-widest mb-4 text-center">Perangkat Persidangan</p>
                  <div className="overflow-x-auto rounded-xl border border-base-200">
                    <table className="table table-sm sm:table-md w-full text-base-content">
                      <tbody>
                        <tr className="bg-base-100"><th className="w-1/3 text-base-content/60">Ketua</th><td className="font-bold">{currentSchedule.ketua_majelis}</td></tr>
                        <tr className="bg-base-200/50"><th className="text-base-content/60">Anggota 1</th><td className="font-bold">{currentSchedule.anggota_1}</td></tr>
                        {currentSchedule.anggota_2 && <tr className="bg-base-100"><th className="text-base-content/60">Anggota 2</th><td className="font-bold">{currentSchedule.anggota_2}</td></tr>}
                        {currentSchedule.mediator && <tr className="bg-base-200/50"><th className="text-base-content/60">Mediator</th><td className="font-bold">{currentSchedule.mediator}</td></tr>}
                        <tr className="bg-base-100"><th className="text-base-content/60">Panitera</th><td className="font-bold">{currentSchedule.panitera}</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Footer Modal - Sticky */}
              <div className="p-4 bg-base-200 flex justify-between items-center flex-shrink-0 border-t border-base-300">
                <div className="flex gap-2">
                  {selectedDaySchedules.length > 1 && selectedDaySchedules.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentSlide(idx)}
                      className={`btn btn-sm btn-circle ${currentSlide === idx ? 'btn-primary' : 'btn-ghost bg-base-100 border border-base-300'}`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-neutral px-6 sm:px-8 shadow-sm"
                >
                  Tutup
                </button>
              </div>
            </>
          )}
        </div>
        <form method="dialog" className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default PublicCalendarPage;
