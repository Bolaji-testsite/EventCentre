'use client';

import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Users, CheckCircle2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import Link from 'next/link';

interface DateInfo {
  date: string;
  status: 'AVAILABLE' | 'BOOKED';
  interestCount: number;
}

interface CalendarData {
  month: number;
  year: number;
  dates: DateInfo[];
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState<CalendarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<DateInfo | null>(null);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  useEffect(() => {
    fetchCalendarData();
  }, [currentDate]);

  const fetchCalendarData = async () => {
    setLoading(true);
    try {
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();

      const response = await fetch(`/api/calendar?month=${month}&year=${year}`);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();

      setCalendarData(data);
    } catch (error) {
      console.error('Error fetching calendar:', error);
    } finally {
      setLoading(false);
    }
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const getFirstDayOfMonth = () => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  };

  const isToday = (dateStr: string) => {
    const today = new Date();
    return dateStr === today.toISOString().split('T')[0];
  };

  const isPast = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const checkDate = new Date(dateStr);
    return checkDate < today;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-lg">
                  <CalendarIcon className="h-8 w-8 text-white" />
                </div>
                Event Centre Calendar
              </h1>
              <p className="text-slate-600 mt-2 text-lg">
                Browse available dates and book your special event
              </p>
            </div>
            <Link href="/book">
              <Button size="lg" className="shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                Book Now
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-between bg-white rounded-2xl p-6 shadow-md border border-slate-200">
            <Button
              variant="outline"
              size="lg"
              onClick={goToPreviousMonth}
              className="hover:bg-slate-50 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-slate-900">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <Button
                variant="outline"
                size="sm"
                onClick={goToToday}
                className="hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                Today
              </Button>
            </div>

            <Button
              variant="outline"
              size="lg"
              onClick={goToNextMonth}
              className="hover:bg-slate-50 transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>

        <Card className="p-6 bg-white shadow-xl rounded-2xl border-slate-200">
          <div className="grid grid-cols-7 gap-4 mb-4">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center font-semibold text-slate-600 text-sm uppercase tracking-wider py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-7 gap-4">
              {Array.from({ length: 35 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl bg-slate-100 animate-pulse"
                />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-7 gap-4">
              {Array.from({ length: getFirstDayOfMonth() }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}

              {calendarData?.dates.map((dateInfo) => {
                const dayNum = parseInt(dateInfo.date.split('-')[2]);
                const past = isPast(dateInfo.date);
                const today = isToday(dateInfo.date);
                const available = dateInfo.status === 'AVAILABLE';
                const booked = dateInfo.status === 'BOOKED';

                return (
                  <button
                    key={dateInfo.date}
                    onClick={() => !past && setSelectedDate(dateInfo)}
                    disabled={past}
                    className={`
                      aspect-square rounded-xl p-3 relative overflow-hidden
                      transition-all duration-300 group
                      ${past ? 'opacity-40 cursor-not-allowed bg-slate-50' : 'cursor-pointer hover:scale-105 hover:shadow-lg'}
                      ${today ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
                      ${available && !past ? 'bg-gradient-to-br from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-2 border-green-200' : ''}
                      ${booked && !past ? 'bg-gradient-to-br from-slate-100 to-slate-200 border-2 border-slate-300' : ''}
                    `}
                  >
                    <div className="relative z-10 h-full flex flex-col items-center justify-center">
                      <span className={`text-lg font-bold mb-1 ${past ? 'text-slate-400' : booked ? 'text-slate-700' : 'text-slate-900'}`}>
                        {dayNum}
                      </span>

                      {!past && (
                        <>
                          {booked ? (
                            <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-slate-700 text-white">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Booked
                            </Badge>
                          ) : (
                            <div className="space-y-1">
                              <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-green-600 text-white">
                                Available
                              </Badge>
                              {dateInfo.interestCount > 0 && (
                                <div className="flex items-center justify-center gap-1 text-xs text-amber-700 font-medium">
                                  <Users className="h-3 w-3" />
                                  <span>{dateInfo.interestCount}</span>
                                </div>
                              )}
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {!past && !booked && (
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-blue-600/0 group-hover:from-blue-500/10 group-hover:to-blue-600/10 transition-all duration-300" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </Card>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-600 rounded-xl">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Available</p>
                <p className="text-sm text-slate-600">Ready to book</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-600 rounded-xl">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Interest Count</p>
                <p className="text-sm text-slate-600">Others interested</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-slate-700 rounded-xl">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-slate-900">Booked</p>
                <p className="text-sm text-slate-600">Not available</p>
              </div>
            </div>
          </Card>
        </div>

        {selectedDate && (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => setSelectedDate(null)}
          >
            <Card
              className="max-w-md w-full p-6 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                {new Date(selectedDate.date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </h3>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                  <div className={`p-3 rounded-lg ${selectedDate.status === 'AVAILABLE' ? 'bg-green-600' : 'bg-slate-700'}`}>
                    {selectedDate.status === 'AVAILABLE' ? (
                      <CheckCircle2 className="h-6 w-6 text-white" />
                    ) : (
                      <Clock className="h-6 w-6 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">
                      {selectedDate.status === 'AVAILABLE' ? 'Available' : 'Booked'}
                    </p>
                    <p className="text-sm text-slate-600">
                      {selectedDate.status === 'AVAILABLE'
                        ? 'This date is available for booking'
                        : 'This date has been confirmed'}
                    </p>
                  </div>
                </div>

                {selectedDate.interestCount > 0 && selectedDate.status === 'AVAILABLE' && (
                  <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-200">
                    <Users className="h-6 w-6 text-amber-700" />
                    <div>
                      <p className="font-semibold text-slate-900">
                        {selectedDate.interestCount} {selectedDate.interestCount === 1 ? 'person' : 'people'} interested
                      </p>
                      <p className="text-sm text-slate-600">
                        Others have requested this date. Secure it with payment!
                      </p>
                    </div>
                  </div>
                )}

                {selectedDate.status === 'AVAILABLE' && (
                  <Link href={`/book?date=${selectedDate.date}`}>
                    <Button className="w-full" size="lg">
                      Book This Date
                    </Button>
                  </Link>
                )}

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setSelectedDate(null)}
                >
                  Close
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
