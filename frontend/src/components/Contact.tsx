import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone, Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useCMS } from "@/context/CMSContext";
import emailjs from "@emailjs/browser";
import { toast } from "sonner";

const Contact = () => {
  const { contact, emailjs: emailConfig } = useCMS();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [consent, setConsent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    // Form Validations
    if (!formData.name.trim()) {
      const msg = "Please enter your name.";
      toast.error(msg);
      setStatusMessage({ type: "error", text: msg });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      const msg = "Please enter a valid email address.";
      toast.error(msg);
      setStatusMessage({ type: "error", text: msg });
      return;
    }

    if (!formData.message.trim()) {
      const msg = "Please enter your message.";
      toast.error(msg);
      setStatusMessage({ type: "error", text: msg });
      return;
    }

    if (!consent) {
      const msg = "Please accept the consent before submitting.";
      toast.error(msg);
      setStatusMessage({ type: "error", text: msg });
      return;
    }

    setIsSending(true);

    try {
      const templateParams = {
        from_name: formData.name.trim(),
        from_email: formData.email.trim(),
        subject: formData.subject.trim() || "Portfolio Contact Request",
        message: formData.message.trim(),
        to_email: contact?.email || "shambel5110@gmail.com",
        email: contact?.email || "shambel5110@gmail.com",
        shanbelkibre: formData.name.trim(),
        title: formData.subject.trim() || "Portfolio Contact Request",
        submission_time: new Date().toISOString(),
      };

      await emailjs.send(
        emailConfig.serviceId || "service_portfolio",
        emailConfig.templateId || "template_contact",
        templateParams,
        {
          publicKey: emailConfig.publicKey !== "user_public_key_placeholder" ? emailConfig.publicKey : undefined,
        }
      );

      // Reset form and show success message
      setFormData({ name: "", email: "", subject: "", message: "" });
      setConsent(false);
      const successText = "Message sent successfully! Thank you for contacting me.";
      toast.success(successText);
      setStatusMessage({ type: "success", text: successText });
    } catch (err) {
      // Technical errors logged only in console for development
      console.error("Submission failed:", err);
      const errorText = "Sorry, your message could not be sent. Please try again.";
      toast.error(errorText);
      setStatusMessage({ type: "error", text: errorText });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="contact" className="pb-20 py-20">
      <div className="container max-w-5xl mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12 reveal-up">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
            Get In <span className="text-gradient">Touch</span>
          </h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Available for freelance projects, full-stack development, and cybersecurity contracts. Send a message directly via email!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Direct Contact Card (5 cols) */}
          <div className="reveal-left lg:col-span-5 flex">
            <Card className="w-full p-6 sm:p-8 bg-card/70 backdrop-blur-md border border-border/80 rounded-2xl shadow-xl hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-foreground mb-4">
                  Contact Information
                </h3>

                {/* Email Item - Focuses the contact form */}
                <a
                  href="#email"
                  onClick={(e) => {
                    e.preventDefault();
                    const nameInput = document.querySelector<HTMLInputElement>('input[name="name"]');
                    nameInput?.focus();
                    nameInput?.scrollIntoView({ behavior: "smooth", block: "center" });
                  }}
                  className="flex items-start gap-4 p-4 rounded-xl bg-secondary/30 border border-border/40 hover:bg-secondary/70 hover:border-primary/40 hover:scale-[1.02] hover:shadow-sm transition-all duration-200 group block cursor-pointer"
                >
                  <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all duration-200 shadow-sm">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">
                      Direct Email
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground break-all font-medium mt-0.5">
                      {contact?.email || "Shambel5110@gmail.com"}
                    </p>
                  </div>
                </a>

                {/* Phone Item */}
                <a
                  href={`tel:${contact?.phone?.replace(/\s+/g, "") || ""}`}
                  className="flex items-start gap-4 p-4 rounded-xl bg-secondary/30 border border-border/40 hover:bg-secondary/70 hover:border-primary/40 hover:scale-[1.02] hover:shadow-sm transition-all duration-200 group block"
                >
                  <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all duration-200 shadow-sm">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">
                      Phone & WhatsApp
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-0.5">
                      {contact?.phone || "094 6340 709 / 096 2585 655"}
                    </p>
                  </div>
                </a>

                {/* Location Item */}
                <div className="flex items-start gap-4 p-4 rounded-xl bg-secondary/30 border border-border/40 hover:bg-secondary/70 hover:border-primary/40 hover:scale-[1.02] hover:shadow-sm transition-all duration-200 group cursor-default">
                  <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0 group-hover:bg-primary group-hover:text-primary-foreground group-hover:scale-110 transition-all duration-200 shadow-sm">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">
                      Location
                    </h4>
                    <p className="text-xs sm:text-sm text-muted-foreground font-medium mt-0.5">
                      {contact?.location || "Addis Ababa & Debre Birhan, Ethiopia"}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Email Contact Form (7 cols) */}
          <div className="reveal-right lg:col-span-7 flex" id="email">
            <Card className="w-full p-6 sm:p-8 bg-card/70 backdrop-blur-md border border-border/80 rounded-2xl shadow-xl hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2 text-foreground">
                  <Send className="w-5 h-5 text-primary" />
                  Send Me a Message
                </h3>
                <p className="text-xs text-muted-foreground mb-6">
                  Fill in your details below and I will get back to you within 24 hours.
                </p>

                {statusMessage && (
                  <div
                    className={`p-4 rounded-xl mb-6 flex items-start gap-3 text-xs md:text-sm font-medium ${
                      statusMessage.type === "success"
                        ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400"
                        : "bg-destructive/10 border border-destructive/30 text-destructive"
                    }`}
                  >
                    {statusMessage.type === "success" ? (
                      <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    )}
                    <span>{statusMessage.text}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Your Name </label>
                      <Input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. shanbel kibre"
                        required
                        className="bg-secondary/30 border-border/70 hover:border-primary/40 focus-visible:ring-primary transition-all duration-200"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-muted-foreground">Your Email </label>
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="shambel5110@gmail.com"
                        required
                        className="bg-secondary/30 border-border/70 hover:border-primary/40 focus-visible:ring-primary transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Subject</label>
                    <Input
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Project Inquiry / Job Opportunity"
                      className="bg-secondary/30 border-border/70 hover:border-primary/40 focus-visible:ring-primary transition-all duration-200"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Message </label>
                    <Textarea
                      rows={4}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Hi Shanbel, I'd like to discuss a project with you..."
                      required
                      className="bg-secondary/30 border-border/70 hover:border-primary/40 focus-visible:ring-primary resize-none transition-all duration-200"
                    />
                  </div>

                  {/* Consent Checkbox */}
                  <div className="pt-1">
                    <label className="flex items-start gap-2.5 cursor-pointer text-xs text-muted-foreground select-none">
                      <input
                        type="checkbox"
                        checked={consent}
                        onChange={(e) => setConsent(e.target.checked)}
                        className="mt-0.5 rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer accent-primary"
                      />
                      <span>I agree to have my information used to respond to my message.</span>
                    </label>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={isSending}
                    className="w-full gap-2 shadow-md hover:shadow-xl hover:scale-[1.01] transition-all duration-200"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message via Email
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
