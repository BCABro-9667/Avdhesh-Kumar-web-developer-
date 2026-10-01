// EmailJS Configuration with defaults provided by user
export const EMAILJS_CONFIG = {
  publicKey: (import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string) || "zPPFP74bsEruexByu",
  serviceId: (import.meta.env.VITE_EMAILJS_SERVICE_ID as string) || "NqCcuSJHUtbYptT6IVP6U",
  templateId: (import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string) || "template_hnt5kvf",
};

export interface ContactEmailParams {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Sends contact inquiry via EmailJS (dynamically loads SDK on demand)
 */
export async function sendContactEmail(params: ContactEmailParams) {
  const { default: emailjs } = await import("@emailjs/browser");

  try {
    emailjs.init({
      publicKey: EMAILJS_CONFIG.publicKey,
    });
  } catch (e) {
    // ignore if already initialized
  }

  // Pass all standard EmailJS variable aliases matching user template:
  const templateParams: Record<string, string> = {
    name: params.name,
    email: params.email,
    subject: params.subject,
    message: params.message,
    Name: params.name,
    Email: params.email,
    Subject: params.subject,
    Message: params.message,
    "Email Address": params.email,
    "Message Content": params.message,
    to_email: "avdhesh6968@gmail.com",
    recipient_email: "avdhesh6968@gmail.com",
    recipient: "avdhesh6968@gmail.com",
    to_name: "Avdhesh Kumar",
    reply_to: params.email,
    from_name: params.name,
    from_email: params.email,
    user_name: params.name,
    user_email: params.email,
    date: new Date().toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
  };

  const response = await emailjs.send(
    EMAILJS_CONFIG.serviceId,
    EMAILJS_CONFIG.templateId,
    templateParams,
    {
      publicKey: EMAILJS_CONFIG.publicKey,
    }
  );

  console.log("EmailJS message sent successfully:", response);
  return response;
}
