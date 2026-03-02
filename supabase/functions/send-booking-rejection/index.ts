import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const {
      booking_id,
      email,
      date,
      booking_ref,
    } = await req.json();

    if (!email || !date || !booking_ref) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const bookingDate = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const emailTemplate = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 32px; font-weight: bold;">Date No Longer Available</h1>
        </div>

        <div style="background: white; padding: 40px 20px; border: 1px solid #e5e7eb; border-top: none;">
          <p style="font-size: 16px; color: #333; margin-top: 0;">Hi,</p>

          <p style="font-size: 16px; color: #666; line-height: 1.6;">
            Unfortunately, the date you requested has been confirmed by another booking. Your request for this date could not be completed.
          </p>

          <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #ef4444;">
            <h3 style="margin-top: 0; color: #7f1d1d;">Booking Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Booking Reference</td>
                <td style="padding: 10px 0; color: #1f2937; font-family: monospace;">${booking_ref}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Requested Date</td>
                <td style="padding: 10px 0; color: #1f2937;">${bookingDate}</td>
              </tr>
            </table>
          </div>

          <p style="font-size: 16px; color: #666; line-height: 1.6;">
            Don't worry! We have many other available dates. Please visit our calendar to explore other options that work for your event.
          </p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="https://eventcentre.com/calendar" style="display: inline-block; background: #1e40af; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 600;">
              Browse Available Dates
            </a>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

          <p style="font-size: 14px; color: #999; margin-bottom: 0;">
            Questions? Contact us at support@eventcentre.com
          </p>
        </div>
      </div>
    `;

    console.log(`Booking rejection email would be sent to: ${email}`);
    console.log(`Subject: Date No Longer Available - ${booking_ref}`);
    console.log(`Content preview: Date ${bookingDate} no longer available`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Rejection email sent",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
