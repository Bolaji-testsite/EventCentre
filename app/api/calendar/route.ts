import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month');
    const year = searchParams.get('year');

    if (!month || !year) {
      return NextResponse.json(
        { error: 'Month and year parameters are required' },
        { status: 400 }
      );
    }

    const monthNum = parseInt(month);
    const yearNum = parseInt(year);

    if (isNaN(monthNum) || isNaN(yearNum) || monthNum < 1 || monthNum > 12) {
      return NextResponse.json(
        { error: 'Invalid month or year' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get first and last day of the month
    const firstDay = new Date(yearNum, monthNum - 1, 1);
    const lastDay = new Date(yearNum, monthNum, 0);

    const startDate = firstDay.toISOString().split('T')[0];
    const endDate = lastDay.toISOString().split('T')[0];

    // Query all booking requests for this month
    const { data: bookings, error: bookingsError } = await supabase
      .from('booking_requests')
      .select('start_date, end_date, status')
      .gte('start_date', startDate)
      .lte('end_date', endDate);

    if (bookingsError) {
      console.error('Error fetching bookings:', bookingsError);
      return NextResponse.json(
        { error: 'Failed to fetch calendar data' },
        { status: 500 }
      );
    }

    // Query date locks for confirmed bookings
    const { data: dateLocks, error: locksError } = await supabase
      .from('date_locks')
      .select('date')
      .gte('date', startDate)
      .lte('date', endDate);

    if (locksError) {
      console.error('Error fetching date locks:', locksError);
      return NextResponse.json(
        { error: 'Failed to fetch calendar data' },
        { status: 500 }
      );
    }

    const lockedDates = new Set((dateLocks as any)?.map((lock: any) => lock.date) || []);
    const dates: any[] = [];

    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(yearNum, monthNum - 1, day);
      const dateStr = date.toISOString().split('T')[0];

      const isLocked = lockedDates.has(dateStr);
      const interestCount = (bookings as any)?.filter(
        (booking: any) =>
          booking.start_date <= dateStr &&
          booking.end_date >= dateStr &&
          booking.status === 'PENDING'
      ).length || 0;

      dates.push({
        date: dateStr,
        status: isLocked ? 'BOOKED' : 'AVAILABLE',
        interestCount: isLocked ? 0 : interestCount,
      });
    }

    return NextResponse.json({
      month: monthNum,
      year: yearNum,
      dates,
    });
  } catch (error) {
    console.error('Calendar API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
