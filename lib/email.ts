import { Resend } from "resend";
import { ContactPayload } from "./validations";
import { redis } from "./rate-limit";
import { env } from "./env";

export const resend = new Resend(env.RESEND_API_KEY);

export async function sendEnquiryEmail(payload: ContactPayload) {
  let subject = "New Enquiry from TheRootFood";
  let text = "";

  if (payload.enquiryType === "general") {
    subject = `General Enquiry from ${payload.name}`;
    text = `
Name: ${payload.name}
Phone: ${payload.phone}
Email: ${payload.email || "N/A"}

Message:
${payload.message || "No message provided."}
    `;
  } else if (payload.enquiryType === "bulk") {
    subject = `Bulk Order Enquiry from ${payload.businessName}`;
    text = `
Business Name: ${payload.businessName}
Contact Name: ${payload.contactName}
Phone: ${payload.phone}
Email: ${payload.email}
Product Interest: ${payload.productInterest}
Estimated Volume: ${payload.estimatedVolume || "N/A"}

Message:
${payload.message || "No message provided."}
    `;
  } else if (payload.enquiryType === "cake") {
    subject = `Cake Order Enquiry from ${payload.name}`;
    text = `
Name: ${payload.name}
Phone: ${payload.phone}

Cake Details:
Type: ${payload.cakeType}
Size: ${payload.size}
Flavor: ${payload.flavor}
Required Date: ${payload.requiredDate}

Message:
${payload.message || "No message provided."}
    `;
  } else if (payload.enquiryType === "product") {
    subject = `Product Enquiry from ${payload.name}`;
    text = `
Name: ${payload.name}
Phone: ${payload.phone}
Product Interest: ${payload.productSlug}

Message:
${payload.message || "No message provided."}
    `;
  }

  subject = subject.replace(/\r?\n|\r/g, " ");

  try {
    const { data, error } = await resend.emails.send({
      from: "TheRootFood <notifications@therootfood.com>",
      to: [env.CONTACT_NOTIFICATION_EMAIL],
      subject,
      text,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  } catch (err) {
    console.error("[Email] Failed to send email, falling back to Redis queue:", err);
    try {
      await redis.lpush(
        "therootfood:failed_emails",
        JSON.stringify({
          payload,
          subject,
          text,
          timestamp: new Date().toISOString(),
        })
      );
    } catch (redisErr) {
      console.error("[Email] Critical: Failed to save to Redis fallback:", redisErr);
      throw err;
    }
    return { id: "queued_in_redis" };
  }
}
