'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Calendar,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
  BookOpen,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

interface Booking {
  id: string;
  booking_ref: string;
  start_date: string;
  event_type: string;
  attendees: number;
  status: string;
  evidence_status: string;
  created_at: string;
  notes: string | null;
}

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings');
      if (response.status === 401) {
        setAuthenticated(false);
        return;
      }
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setBookings(data.bookings || []);
      setAuthenticated(true);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'REJECTED':
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-slate-100 text-slate-800';
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
        <div className="max-w-2xl mx-auto">
          <Card className="p-12 text-center">
            <AlertCircle className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Authentication Required
            </h2>
            <p className="text-slate-600 mb-6">
              Please sign in to view your bookings
            </p>
            <Link href="/calendar">
              <Button>Back to Calendar</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">My Bookings</h1>
          <p className="text-slate-600">Track your booking requests and confirmations</p>
        </div>

        {loading ? (
          <div className="grid gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <Card key={i} className="p-6 animate-pulse">
                <div className="space-y-3">
                  <div className="h-4 bg-slate-200 rounded w-1/4" />
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                </div>
              </Card>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <Card className="p-12 text-center">
            <BookOpen className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              No bookings yet
            </h2>
            <p className="text-slate-600 mb-6">
              Start by browsing our calendar and making a booking request
            </p>
            <Link href="/calendar">
              <Button>View Calendar</Button>
            </Link>
          </Card>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <Card key={booking.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(booking.status)}
                    <div>
                      <p className="text-xs font-semibold text-slate-600 uppercase">
                        Booking Reference
                      </p>
                      <p className="font-mono text-lg font-bold text-blue-600">
                        {booking.booking_ref}
                      </p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(booking.status)}>
                    {booking.status}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-slate-600 uppercase font-semibold mb-1">
                      Event Details
                    </p>
                    <p className="text-slate-900 font-medium">{booking.event_type}</p>
                    <p className="text-sm text-slate-600">
                      {booking.attendees} attendees
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-600 uppercase font-semibold mb-1">
                      Date
                    </p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      <p className="text-slate-900 font-medium">
                        {new Date(booking.start_date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {booking.notes && (
                  <div className="mb-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-600 uppercase font-semibold mb-1">
                      Notes
                    </p>
                    <p className="text-slate-700">{booking.notes}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-600 uppercase font-semibold mb-1">
                      Payment Status
                    </p>
                    <p className="font-medium text-slate-900">
                      {booking.evidence_status === 'NONE'
                        ? 'Awaiting proof'
                        : booking.evidence_status === 'VERIFIED'
                          ? 'Verified'
                          : 'Under review'}
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <p className="text-xs text-slate-600 uppercase font-semibold mb-1">
                      Submitted
                    </p>
                    <p className="text-sm text-slate-900">
                      {new Date(booking.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {booking.status === 'PENDING' && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900">
                      <strong>Next step:</strong> Reply to your confirmation email with payment proof to complete your booking.
                    </p>
                  </div>
                )}

                {booking.status === 'CONFIRMED' && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <p className="text-sm text-green-900">
                      <strong>Confirmed!</strong> Your booking is confirmed. Check your email for final details.
                    </p>
                  </div>
                )}

                {booking.status === 'REJECTED' && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-900">
                      This booking was not confirmed. <Link href="/calendar" className="underline font-semibold">Try another date</Link>
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Link href="/calendar">
            <Button variant="outline" size="lg">
              Back to Calendar
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
