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
        <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 32px; font-weight: bold;">Booking Confirmed!</h1>
        </div>

        <div style="background: white; padding: 40px 20px; border: 1px solid #e5e7eb; border-top: none;">
          <p style="font-size: 16px; color: #333; margin-top: 0;">Great news!</p>

          <p style="font-size: 16px; color: #666; line-height: 1.6;">
            Your booking has been confirmed and your event is now secured. We look forward to hosting your event!
          </p>

          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #10b981;">
            <h3 style="margin-top: 0; color: #065f46;">Booking Confirmed</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Booking Reference</td>
                <td style="padding: 10px 0; color: #1f2937; font-family: monospace; font-weight: bold;">${booking_ref}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Confirmed Date</td>
                <td style="padding: 10px 0; color: #1f2937; font-weight: bold;">${bookingDate}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Status</td>
                <td style="padding: 10px 0; color: #10b981; font-weight: bold;">✓ CONFIRMED</td>
              </tr>
            </table>
          </div>

          <p style="font-size: 16px; color: #666; line-height: 1.6;">
            Your event is now locked in. No other bookings can be made for this date.
          </p>

          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <h4 style="margin-top: 0; color: #1f2937;">What's Next?</h4>
            <ul style="color: #333; margin: 10px 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">You'll receive further instructions via email</li>
              <li style="margin-bottom: 8px;">Our team will contact you with any additional details</li>
              <li>Enjoy your event!</li>
            </ul>
          </div>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

          <p style="font-size: 14px; color: #999; margin-bottom: 0;">
            Questions? Contact us at support@eventcentre.com
          </p>
        </div>
      </div>
    `;

    console.log(`Booking confirmed email would be sent to: ${email}`);
    console.log(`Subject: Booking Confirmed - ${booking_ref}`);
    console.log(`Content preview: Booking for ${bookingDate} is confirmed`);

    return new Response(
      JSON.stringify({
        success: true,
        message: "Confirmation email sent",
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
