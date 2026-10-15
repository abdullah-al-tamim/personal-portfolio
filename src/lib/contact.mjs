export function validateMessage(values) {
  const message = Object.fromEntries(
    ["user_name", "user_email", "subject", "message"].map((key) => [
      key,
      String(values[key] || "").trim(),
    ]),
  );
  if (values.website) throw new Error("Please leave the website field empty.");
  if (!message.user_name || message.user_name.length > 100)
    throw new Error("Please enter your name (up to 100 characters).");
  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(message.user_email) ||
    message.user_email.length > 254
  )
    throw new Error("Please enter a valid email address.");
  if (!message.subject || message.subject.length > 160)
    throw new Error("Please add a subject (up to 160 characters).");
  if (!message.message || message.message.length > 5000)
    throw new Error("Please write a message (up to 5,000 characters).");
  return message;
}

export function isContactConfigured(config) {
  return Boolean(config.serviceId && config.templateId && config.publicKey);
}

export async function sendContact(values, config, fetcher = fetch) {
  const message = validateMessage(values);
  if (!isContactConfigured(config))
    throw new Error(
      "Direct sending is temporarily unavailable. Please use the email link below.",
    );
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetcher(
      "https://api.emailjs.com/api/v1.0/email/send",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          service_id: config.serviceId,
          template_id: config.templateId,
          user_id: config.publicKey,
          template_params: { ...message, reply_to: message.user_email },
        }),
      },
    );
    if (response.status === 429)
      throw new Error(
        "Too many messages right now. Please wait a minute before trying again.",
      );
    if (!response.ok)
      throw new Error(
        "Your message could not be sent. Your draft is still here; please try again or use the email link.",
      );
  } catch (error) {
    if (error.name === "AbortError" || error instanceof TypeError)
      throw new Error(
        "Delivery could not be confirmed. Your draft is still here. Please check your connection before trying again.",
      );
    throw error;
  } finally {
    clearTimeout(timeout);
  }
}
