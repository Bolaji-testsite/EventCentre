'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Calendar,
  CheckCircle2,
  Users,
  Shield,
  ArrowRight,
  Zap,
  Lock,
  Mail,
} from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center justify-between py-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">EventCentre</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/calendar">
              <Button variant="ghost">View Calendar</Button>
            </Link>
            <Link href="/book">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                Book Now
              </Button>
            </Link>
          </div>
        </nav>

        <div className="py-20 space-y-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-tight">
                  Reserve Your Perfect Event Space
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed">
                  Professional event booking made simple. Browse available dates,
                  submit payment proof, and let us handle the rest.
                </p>
              </div>

              <div className="flex gap-4">
                <Link href="/calendar">
                  <Button size="lg" className="gap-2">
                    View Calendar
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/book">
                  <Button size="lg" variant="outline">
                    Book Now
                  </Button>
                </Link>
              </div>

              <div className="pt-8 space-y-4">
                <p className="text-sm font-semibold text-slate-600 uppercase tracking-wide">
                  Available Now
                </p>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                    <p className="text-3xl font-bold text-blue-600">50+</p>
                    <p className="text-sm text-slate-600 mt-1">Dates Available</p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                    <p className="text-3xl font-bold text-green-600">24h</p>
                    <p className="text-sm text-slate-600 mt-1">Confirmation Time</p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
                    <p className="text-3xl font-bold text-purple-600">100%</p>
                    <p className="text-sm text-slate-600 mt-1">Secure Process</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-200 to-blue-100 rounded-3xl blur-2xl opacity-30" />
              <Card className="relative p-8 bg-white shadow-2xl rounded-3xl border-slate-200">
                <Calendar className="h-16 w-16 text-blue-600 mb-6" />
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  Simple 4-Step Process
                </h3>
                <ul className="space-y-4">
                  {[
                    'Browse calendar and find available dates',
                    'Submit your booking request details',
                    'Send payment proof via email',
                    'Receive confirmation in 24-48 hours',
                  ].map((step, i) => (
                    <li key={i} className="flex gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                        {i + 1}
                      </div>
                      <span className="text-slate-700">{step}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Zap,
                title: 'Quick Booking',
                description:
                  'Submit your booking request in minutes and get instant confirmation.',
              },
              {
                icon: Lock,
                title: 'Secure Payments',
                description:
                  'Submit payment proof securely. Your information is always protected.',
              },
              {
                icon: Mail,
                title: 'Email Updates',
                description:
                  'Stay informed with email updates every step of the way.',
              },
            ].map((feature, i) => (
              <Card
                key={i}
                className="p-8 hover:shadow-lg transition-shadow rounded-2xl group cursor-pointer hover:border-blue-200 border-slate-200"
              >
                <div className="p-4 bg-blue-50 rounded-xl w-fit group-hover:bg-blue-100 transition-colors mb-4">
                  <feature.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600">{feature.description}</p>
              </Card>
            ))}
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-slate-50 rounded-3xl p-12 border border-blue-200">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-3xl font-bold text-slate-900">
                How Payment Works
              </h2>
              <div className="space-y-4">
                {[
                  {
                    title: 'Submit Booking Request',
                    description:
                      "Fill in your event details and preferred date(s). You'll receive a confirmation email with your booking reference.",
                  },
                  {
                    title: 'Prepare Payment Proof',
                    description:
                      'Gather your payment proof (invoice, receipt, bank transfer confirmation, etc.).',
                  },
                  {
                    title: 'Send Evidence',
                    description:
                      'Reply to the confirmation email with your payment proof attached.',
                  },
                  {
                    title: 'Wait for Confirmation',
                    description:
                      'Our team will verify your payment and confirm your booking within 24-48 hours.',
                  },
                ].map((step, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                        {i + 1}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">
                        {step.title}
                      </h4>
                      <p className="text-slate-600 text-sm mt-1">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 rounded-2xl">
              <CheckCircle2 className="h-8 w-8 text-green-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Booking Confirmed
              </h3>
              <p className="text-slate-600 mb-4">
                Once your payment is verified, your date is officially booked.
                You'll receive a final confirmation email with all details.
              </p>
              <p className="text-sm text-slate-700">
                No other bookings can be made for that date.
              </p>
            </Card>

            <Card className="p-8 rounded-2xl">
              <Users className="h-8 w-8 text-blue-600 mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                See Interest
              </h3>
              <p className="text-slate-600 mb-4">
                View how many people are interested in each date while it's
                still available. Secure your spot today!
              </p>
              <p className="text-sm text-slate-700">
                More interest = faster confirmation.
              </p>
            </Card>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-12 text-white text-center space-y-6">
            <h2 className="text-4xl font-bold">Ready to Book?</h2>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto">
              Browse our available dates and submit your booking request today.
              Our team is ready to help!
            </p>
            <div className="flex gap-4 justify-center pt-4">
              <Link href="/calendar">
                <Button size="lg" variant="secondary">
                  View Calendar
                </Button>
              </Link>
              <Link href="/book">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  Book Now
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <footer className="border-t border-slate-200 py-12 mt-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="text-slate-600">© 2024 EventCentre. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="mailto:support@eventcentre.com" className="text-slate-600 hover:text-slate-900">
                Contact
              </a>
              <a href="#" className="text-slate-600 hover:text-slate-900">
                Privacy
              </a>
              <a href="#" className="text-slate-600 hover:text-slate-900">
                Terms
              </a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
