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
      name,
      date,
      booking_ref,
    } = await req.json();

    if (!email || !name || !date || !booking_ref) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Format date nicely
    const bookingDate = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Email template
    const emailTemplate = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%); color: white; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 32px; font-weight: bold;">Booking Request Received!</h1>
        </div>

        <div style="background: white; padding: 40px 20px; border: 1px solid #e5e7eb; border-top: none;">
          <p style="font-size: 16px; color: #333; margin-top: 0;">Hi ${name},</p>

          <p style="font-size: 16px; color: #666; line-height: 1.6;">
            Thank you for your booking request! We've received it and will review your information shortly.
          </p>

          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <h3 style="margin-top: 0; color: #1f2937;">Your Booking Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Booking Reference</td>
                <td style="padding: 10px 0; color: #1f2937; font-family: monospace; font-weight: bold;">${booking_ref}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; color: #6b7280; font-weight: 600;">Preferred Date</td>
                <td style="padding: 10px 0; color: #1f2937;">${bookingDate}</td>
              </tr>
            </table>
          </div>

          <div style="background: #eff6ff; padding: 20px; border-left: 4px solid #1e40af; border-radius: 4px; margin: 30px 0;">
            <h4 style="margin-top: 0; color: #1e40af;">Next Steps</h4>
            <ol style="color: #333; margin: 10px 0; padding-left: 20px;">
              <li style="margin-bottom: 8px;">Prepare your payment proof (receipt, invoice, bank transfer confirmation, etc.)</li>
              <li style="margin-bottom: 8px;">Reply to this email with your payment proof attached</li>
              <li>Our team will verify and confirm your booking within 24-48 hours</li>
            </ol>
          </div>

          <p style="font-size: 16px; color: #666; line-height: 1.6;">
            When replying, please use the subject line: <strong>${booking_ref}</strong>
          </p>

          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">

          <p style="font-size: 14px; color: #999; margin-bottom: 0;">
            Questions? Contact us at support@eventcentre.com
          </p>
        </div>
      </div>
    `;

    // For MVP, we'll just log this. In production, integrate with SendGrid/Mailgun/AWS SES
    console.log(`Booking confirmation email would be sent to: ${email}`);
    console.log(`Subject: Your Event Centre Booking Request - ${booking_ref}`);
    console.log(`Content preview: Booking for ${bookingDate}`);

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
