import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();

    const {
      name,
      email,
      phone,
      date,
      eventType,
      attendees,
      notes,
    } = body;

    if (!name || !email || !date || !eventType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data: { user } } = await supabase.auth.getUser();

    const bookingRef = `BK-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    const { data: booking, error: bookingError } = await (supabase
      .from('booking_requests') as any)
      .insert({
        user_id: user?.id || null,
        guest_name: !user ? name : undefined,
        guest_email: !user ? email : undefined,
        guest_phone: !user ? phone : undefined,
        start_date: date,
        end_date: date,
        event_type: eventType,
        attendees: attendees || 0,
        notes: notes || null,
        booking_ref: bookingRef,
        status: 'PENDING',
        evidence_status: 'NONE',
      } as any)
      .select()
      .single();

    if (bookingError) {
      console.error('Error creating booking:', bookingError);
      return NextResponse.json(
        { error: 'Failed to create booking' },
        { status: 500 }
      );
    }

    try {
      await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/send-booking-confirmation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          booking_id: booking.id,
          email: email || booking.guest_email,
          name: name || booking.guest_name,
          date,
          booking_ref: bookingRef,
        }),
      });
    } catch (emailError) {
      console.error('Error sending confirmation email:', emailError);
    }

    return NextResponse.json({
      success: true,
      booking,
      message: 'Booking request created successfully',
    });
  } catch (error) {
    console.error('Booking creation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { data: bookings, error } = await supabase
      .from('booking_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching bookings:', error);
      return NextResponse.json(
        { error: 'Failed to fetch bookings' },
        { status: 500 }
      );
    }

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error('Get bookings API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
