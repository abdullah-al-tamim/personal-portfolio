"use client";
import { useRef, useState } from "react";
import { isContactConfigured, sendContact } from "@/lib/contact.mjs";

const config = {
  serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID,
  templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID,
  publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY,
};

export default function ContactForm() {
  const [state, setState] = useState("idle");
  const [feedback, setFeedback] = useState("");
  const inFlight = useRef(false);
  const sentAt = useRef(0);
  const configured = isContactConfigured(config);
  async function submit(event) {
    event.preventDefault();
    if (inFlight.current) return;
    if (Date.now() - sentAt.current < 30000) {
      setState("error");
      setFeedback("Please wait a moment before sending another message.");
      return;
    }
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    inFlight.current = true;
    setState("sending");
    setFeedback("");
    try {
      await sendContact(values, config);
      setState("success");
      setFeedback("Message sent. Thank you for getting in touch.");
      sentAt.current = Date.now();
      form.reset();
    } catch (error) {
      setState("error");
      setFeedback(error.message);
    } finally {
      inFlight.current = false;
    }
  }
  return (
    <div className="contact-compose">
      <div className="contact-compose-intro">
        <p className="micro">A NOTE, DIRECTLY TO MY INBOX</p>
        <h3>
          Tell me what
          <br /> you have in mind.
        </h3>
        <p>
          A technical challenge, a research question, or a conversation worth
          starting.
        </p>
      </div>
      <form
        onSubmit={submit}
        className="contact-form"
        aria-label="Send Tamim a message"
        aria-busy={state === "sending"}
      >
        <fieldset disabled={state === "sending"}>
          <legend className="sr-only">Your message</legend>
          <div className="form-row">
            <label htmlFor="contact-name">
              Your name
              <input
                id="contact-name"
                name="user_name"
                autoComplete="name"
                required
                maxLength={100}
              />
            </label>
            <label htmlFor="contact-email">
              Your email
              <input
                id="contact-email"
                name="user_email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
              />
            </label>
          </div>
          <label htmlFor="contact-subject">
            Subject
            <input
              id="contact-subject"
              name="subject"
              required
              maxLength={160}
            />
          </label>
          <label htmlFor="contact-message">
            Message
            <textarea
              id="contact-message"
              name="message"
              required
              maxLength={5000}
              rows={4}
            />
          </label>
          <div className="form-honeypot" aria-hidden="true">
            <label htmlFor="contact-website">
              Leave this field empty
              <input
                id="contact-website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
              />
            </label>
          </div>
          <div className="form-submit-row">
            <button type="submit" disabled={!configured || state === "sending"}>
              {state === "sending" ? "Sending…" : "Send message"}
              <span aria-hidden="true">↗</span>
            </button>
            <p>
              Your name, email, and message are sent via EmailJS so I can reply.
            </p>
          </div>
        </fieldset>
        {!configured && (
          <p className="form-status">
            Direct sending is temporarily unavailable. You can still reach me
            using the email link below.
          </p>
        )}
        <p className={`form-status ${state}`} role="status" aria-live="polite">
          {feedback}
        </p>
        <noscript>
          <p>
            Please enable JavaScript to send this form, or use the email link
            below.
          </p>
        </noscript>
      </form>
    </div>
  );
}
