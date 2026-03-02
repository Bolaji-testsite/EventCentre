import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin: any = await requireAdmin();
    const supabase = await createClient();
    const { id } = params;

    const { data: bookingData, error: fetchError } = await supabase
      .from('booking_requests')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (fetchError || !bookingData) {
      return NextResponse.json(
        { error: 'Booking not found' },
        { status: 404 }
      );
    }

    const booking: any = bookingData;

    if (booking.status === 'CONFIRMED') {
      return NextResponse.json(
        { error: 'Booking is already confirmed' },
        { status: 400 }
      );
    }

    if (booking.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Only pending bookings can be confirmed' },
        { status: 400 }
      );
    }

    const { data: existingLock } = await supabase
      .from('date_locks')
      .select('*')
      .eq('date', booking.start_date)
      .maybeSingle();

    if (existingLock) {
      return NextResponse.json(
        { error: 'Date already confirmed by another booking' },
        { status: 409 }
      );
    }

    const now = new Date().toISOString();

    const { error: confirmError } = await (supabase
      .from('booking_requests') as any)
      .update({
        status: 'CONFIRMED',
        confirmed_at: now,
        confirmed_by: admin.id,
      } as any)
      .eq('id', id);

    if (confirmError) {
      console.error('Error confirming booking:', confirmError);
      return NextResponse.json(
        { error: 'Failed to confirm booking' },
        { status: 500 }
      );
    }

    const { error: lockError } = await (supabase
      .from('date_locks') as any)
      .insert({
        date: booking.start_date,
        confirmed_booking_request_id: id,
      } as any);

    if (lockError) {
      await (supabase
        .from('booking_requests') as any)
        .update({
          status: 'PENDING',
          confirmed_at: null,
          confirmed_by: null,
        } as any)
        .eq('id', id);

      console.error('Error creating date lock:', lockError);
      return NextResponse.json(
        { error: 'Date already confirmed by another booking' },
        { status: 409 }
      );
    }

    const { data: otherBookings } = await supabase
      .from('booking_requests')
      .select('*')
      .eq('status', 'PENDING')
      .gte('start_date', booking.start_date)
      .lte('end_date', booking.start_date)
      .neq('id', id);

    if (otherBookings && otherBookings.length > 0) {
      const otherIds = (otherBookings as any[]).map((b) => b.id);

      const { error: rejectError } = await (supabase
        .from('booking_requests') as any)
        .update({ status: 'REJECTED' } as any)
        .in('id', otherIds);

      if (rejectError) {
        console.error('Error rejecting other bookings:', rejectError);
      }

      for (const otherBooking of otherBookings as any[]) {
        try {
          await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-booking-rejection`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
              booking_id: otherBooking.id,
              email: otherBooking.guest_email || otherBooking.user_id,
              date: booking.start_date,
              booking_ref: otherBooking.booking_ref,
            }),
          });
        } catch (emailError) {
          console.error('Error sending rejection email:', emailError);
        }
      }
    }

    try {
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-booking-confirmed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          booking_id: booking.id,
          email: booking.guest_email || booking.user_id,
          date: booking.start_date,
          booking_ref: booking.booking_ref,
        }),
      });
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
    }

    return NextResponse.json({
      success: true,
      message: 'Booking confirmed successfully',
    });
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message?.includes('Forbidden')) {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      );
    }
    console.error('Confirm booking API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
