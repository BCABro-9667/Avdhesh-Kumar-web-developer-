import emailjs from "@emailjs/browser";

// EmailJS Configuration with defaults provided by user
export const EMAILJS_CONFIG = {
  publicKey: (import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string) || "zPPFP74bsEruexByu",
  serviceId: (import.meta.env.VITE_EMAILJS_SERVICE_ID as string) || "NqCcuSJHUtbYptT6IVP6U",
  templateId: (import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string) || "template_hnt5kvf",
};

// Auto-initialize EmailJS in browser environment with public key
if (typeof window !== "undefined") {
  try {
    emailjs.init({
      publicKey: EMAILJS_CONFIG.publicKey,
    });
  } catch (e) {
    console.warn("EmailJS auto-init note:", e);
  }
}

export interface ContactEmailParams {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Sends contact inquiry via EmailJS
 */
export async function sendContactEmail(params: ContactEmailParams) {
  // Pass all standard EmailJS variable aliases matching user template:
  // Name -> {{name}}
  // Email Address -> {{email}}
  // Subject -> {{subject}}
  // Message Content -> {{message}}
  const templateParams: Record<string, string> = {
    // Exact template variables requested:
    name: params.name,
    email: params.email,
    subject: params.subject,
    message: params.message,

    // Case and spacing variations
    Name: params.name,
    Email: params.email,
    Subject: params.subject,
    Message: params.message,
    "Email Address": params.email,
    "Message Content": params.message,

    // Recipient targets in case the EmailJS template uses {{to_email}} or {{recipient}}
    to_email: "avdhesh6968@gmail.com",
    recipient_email: "avdhesh6968@gmail.com",
    recipient: "avdhesh6968@gmail.com",
    to_name: "Avdhesh Kumar",

    // Standard EmailJS header aliases
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
