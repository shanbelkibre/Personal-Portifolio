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

  const [isSending, setIsSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setIsSending(true);

    try {
      // Attempt EmailJS send
      await emailjs.send(
        emailConfig.serviceId || "service_portfolio",
        emailConfig.templateId || "template_contact",
        {
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject || "Portfolio Contact Request",
          message: formData.message,
          to_email: contact?.email || "",

          // These variables are specifically to match your current EmailJS template!
          email: contact?.email || "shambel5110@gmail.com",
          shanbelkibre: formData.name,
          title: formData.subject || "Portfolio Contact Request",
        },
        {
          publicKey: emailConfig.publicKey !== "user_public_key_placeholder" ? emailConfig.publicKey : undefined
        }
      );

      toast.success("Thank you! Your message has been sent successfully.");
      setStatusMessage({
        type: "success",
        text: "Your message was sent successfully! I will reply to your email shortly.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err: unknown) {
      // Show the exact error so we can debug why EmailJS is failing
      const error = err as { text?: string; message?: string };
      const errorMessage = error?.text || error?.message || "Unknown error occurred";
      toast.error(`EmailJS Failed: ${errorMessage}`);
      setStatusMessage({
        type: "error",
        text: `EmailJS Error: ${errorMessage}. Please check your keys or template!`,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section id="contact" className="pb-20 py-20">
      <div className="container max-w-5xl mx-auto px-4">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
            Get In <span className="text-gradient">Touch</span>
          </h2>
          <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
            Available for freelance projects, full-stack development, and cybersecurity contracts. Send a message directly via email!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Direct Contact Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="p-6 bg-card border-border shadow-md hover:shadow-lg transition-all space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-base">Direct Email</h3>
                  <a
                    href="#email"
                    className="text-sm text-muted-foreground hover:text-primary transition-colors break-all font-medium"
                  >
                    {contact?.email || "Loading..."}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-4 border-t border-border">
                <div className="p-3 rounded-full bg-primary/10 text-primary shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-base">Phone & WhatsApp</h3>
                  <a
                    href={`tel:${contact?.phone?.replace(/\s+/g, "") || ""}`}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
                  >
                    {contact?.phone || "Loading..."}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4 pt-4 border-t border-border">
                <div className="p-3 rounded-full bg-primary/10 text-primary shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-base">Location</h3>
                  <p className="text-sm text-muted-foreground font-medium">{contact?.location || "Loading..."}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* EmailJS Contact Form (7 cols) */}
          <div className="lg:col-span-7" id="email">
            <Card className="p-6 sm:p-8 bg-card border-border shadow-lg card-glow">
              <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                <Send className="w-5 h-5 text-primary" />
                Send Me a Message
              </h3>
              <p className="text-xs text-muted-foreground mb-6">
                Fill in your details below and I will get back to you within 24 hours.
              </p>

              {statusMessage && (
                <div
                  className={`p-4 rounded-xl mb-6 flex items-start gap-3 text-xs md:text-sm font-medium ${statusMessage.type === "success"
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
                    <label className="text-xs font-semibold text-muted-foreground">Your Name *</label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                      required
                      className="bg-secondary/40 border-border focus-visible:ring-primary"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-muted-foreground">Your Email *</label>
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                      className="bg-secondary/40 border-border focus-visible:ring-primary"
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
                    className="bg-secondary/40 border-border focus-visible:ring-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Message *</label>
                  <Textarea
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Hi Shanbel, I'd like to discuss a project with you..."
                    required
                    className="bg-secondary/40 border-border focus-visible:ring-primary resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  disabled={isSending}
                  className="w-full gap-2 shadow-md hover:shadow-xl transition-all"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending Message...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message via Email
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
