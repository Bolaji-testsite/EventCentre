'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertCircle,
  CheckCircle2,
  Calendar,
  Mail,
  Phone,
  Users,
  FileText,
} from 'lucide-react';
import Link from 'next/link';

const eventTypes = [
  'Wedding',
  'Birthday',
  'Corporate Event',
  'Conference',
  'Workshop',
  'Seminar',
  'Private Party',
  'Other',
];

function BookingFormContent() {
  const searchParams = useSearchParams();
  const initialDate = searchParams.get('date');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: initialDate || '',
    eventType: '',
    attendees: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookingRef, setBookingRef] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      eventType: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (
        !formData.name ||
        !formData.email ||
        !formData.date ||
        !formData.eventType
      ) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          date: formData.date,
          eventType: formData.eventType,
          attendees: formData.attendees ? parseInt(formData.attendees) : 0,
          notes: formData.notes,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create booking');
      }

      const data = await response.json();
      setBookingRef(data.booking.booking_ref);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to submit booking');
    } finally {
      setLoading(false);
    }
  };

  if (submitted && bookingRef) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-xl rounded-2xl">
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-4 bg-green-600 rounded-full">
                <CheckCircle2 className="h-12 w-12 text-white" />
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Booking Request Submitted!
              </h2>
              <p className="text-lg text-slate-700">
                We've received your booking request. A confirmation email has
                been sent to you.
              </p>
            </div>

            <div className="bg-white rounded-xl p-6 border border-green-200 space-y-4">
              <div>
                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                  Booking Reference
                </p>
                <p className="text-2xl font-bold text-green-600 font-mono mt-1">
                  {bookingRef}
                </p>
                <p className="text-xs text-slate-600 mt-2">
                  Save this for your records
                </p>
              </div>

              <div className="border-t border-green-200 pt-4 space-y-3">
                <h4 className="font-semibold text-slate-900">Next Steps:</h4>
                <ol className="space-y-2 text-sm text-slate-700">
                  <li className="flex gap-3">
                    <span className="font-bold text-green-600 min-w-6">1.</span>
                    <span>
                      Review the confirmation email sent to {formData.email}
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-green-600 min-w-6">2.</span>
                    <span>Prepare payment proof (invoice, receipt, etc.)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-green-600 min-w-6">3.</span>
                    <span>
                      Reply to the confirmation email with your payment proof
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="font-bold text-green-600 min-w-6">4.</span>
                    <span>
                      Our team will verify and confirm your booking (24-48 hours)
                    </span>
                  </li>
                </ol>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Need help?</strong> Contact us at{' '}
                  <a href="mailto:support@eventcentre.com" className="text-blue-600 hover:underline">
                    support@eventcentre.com
                  </a>
                </p>
              </div>
            </div>

            <div className="flex gap-3 justify-center">
              <Link href="/calendar">
                <Button variant="outline" size="lg">
                  View Calendar
                </Button>
              </Link>
              <Button
                size="lg"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    date: '',
                    eventType: '',
                    attendees: '',
                    notes: '',
                  });
                }}
              >
                Book Another Date
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-3">
          Request Your Booking
        </h1>
        <p className="text-lg text-slate-600">
          Fill in the details below and we'll get back to you within 24 hours.
        </p>
      </div>

      <Card className="p-8 shadow-xl rounded-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <div>
            <Label htmlFor="name" className="text-base font-semibold mb-2">
              Full Name <span className="text-red-600">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
              className="rounded-lg"
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-base font-semibold mb-2">
              <Mail className="inline h-4 w-4 mr-2" />
              Email Address <span className="text-red-600">*</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
              className="rounded-lg"
            />
            <p className="text-xs text-slate-600 mt-1">
              We'll send confirmation and updates here
            </p>
          </div>

          <div>
            <Label htmlFor="phone" className="text-base font-semibold mb-2">
              <Phone className="inline h-4 w-4 mr-2" />
              Phone Number
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 123-4567"
              className="rounded-lg"
            />
          </div>

          <div>
            <Label htmlFor="date" className="text-base font-semibold mb-2">
              <Calendar className="inline h-4 w-4 mr-2" />
              Preferred Date <span className="text-red-600">*</span>
            </Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="rounded-lg"
            />
          </div>

          <div>
            <Label htmlFor="eventType" className="text-base font-semibold mb-2">
              <FileText className="inline h-4 w-4 mr-2" />
              Event Type <span className="text-red-600">*</span>
            </Label>
            <Select value={formData.eventType} onValueChange={handleSelectChange}>
              <SelectTrigger className="rounded-lg">
                <SelectValue placeholder="Select event type" />
              </SelectTrigger>
              <SelectContent>
                {eventTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="attendees" className="text-base font-semibold mb-2">
              <Users className="inline h-4 w-4 mr-2" />
              Expected Attendees
            </Label>
            <Input
              id="attendees"
              name="attendees"
              type="number"
              value={formData.attendees}
              onChange={handleChange}
              placeholder="50"
              min="0"
              className="rounded-lg"
            />
          </div>

          <div>
            <Label htmlFor="notes" className="text-base font-semibold mb-2">
              Additional Notes
            </Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Any special requirements or notes..."
              className="rounded-lg min-h-24"
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              After submitting, you'll receive a confirmation email with
              instructions on how to submit payment proof.
            </p>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="w-full rounded-lg"
          >
            {loading ? 'Submitting...' : 'Submit Booking Request'}
          </Button>
        </form>
      </Card>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <h3 className="font-semibold text-slate-900 mb-3">How It Works</h3>
          <ol className="space-y-2 text-sm text-slate-600">
            <li>1. Submit your booking request</li>
            <li>2. Receive confirmation email</li>
            <li>3. Submit payment proof</li>
            <li>4. We confirm your booking</li>
          </ol>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold text-slate-900 mb-3">Need Help?</h3>
          <p className="text-sm text-slate-600 mb-3">
            Contact our support team for any questions.
          </p>
          <a
            href="mailto:support@eventcentre.com"
            className="text-blue-600 hover:underline text-sm font-semibold"
          >
            support@eventcentre.com
          </a>
        </Card>
      </div>
    </div>
  );
}

export default function BookPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <Suspense fallback={<div className="h-screen bg-slate-100" />}>
        <BookingFormContent />
      </Suspense>
    </div>
  );
}
