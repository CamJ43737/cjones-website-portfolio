"use client";

import { FormEvent, useState } from "react";
import { Github, Linkedin, Mail, Camera } from "lucide-react";
import { contactReasons, site } from "@/data/content";
import { mediaAssignments } from "@/data/media-assignments";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { MediaImage } from "@/components/ui/MediaImage";
import { asset } from "@/lib/asset";

export function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("https://formspree.io/f/xvzyvyao", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <Section id="connect" eyebrow="Connect" title="Let's Build Something Together.">
      <Reveal>
        <div className="mb-10 max-w-3xl space-y-4 sm:mb-12 lg:mb-14">
          <p className="prose-brand">
            Whether you are a researcher, recruiter, collaborator, entrepreneur, photographer, or
            someone looking for help bringing an idea to life, I would love to connect.
          </p>
          <p className="prose-brand">
            I am always open to conversations around artificial intelligence, robotics, research
            opportunities, creative projects, photography, and building technology that creates
            meaningful impact.
          </p>
        </div>
      </Reveal>

      <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
        <Reveal className="lg:col-span-5">
          <div className="space-y-6">
            <MediaImage
              src={mediaAssignments.contact.src}
              alt={mediaAssignments.contact.alt}
              fit="cover"
              objectPosition="50% 50%"
              className="aspect-[4/5] w-full max-w-md lg:max-w-none"
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Button href={`mailto:${site.email}`} className="w-full">
                <Mail size={16} /> Email Me
              </Button>
              <Button
                href={asset(site.resumePath)}
                variant="ghost"
                download
                className="w-full"
              >
                Download Resume
              </Button>
              <Button href={site.linkedin} variant="ghost" external className="w-full">
                <Linkedin size={16} /> LinkedIn
              </Button>
              <Button href={site.github} variant="ghost" external className="w-full">
                <Github size={16} /> GitHub
              </Button>
              <Button href="/beyond" variant="gold" className="w-full sm:col-span-2">
                <Camera size={16} /> Beyond the Lab
              </Button>
            </div>
            <div className="text-sm text-ink-400">
              <p>
                <span className="text-ink-200">Email:</span> {site.email}
              </p>
              <p className="mt-1">
                <span className="text-ink-200">Location:</span> {site.location}
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-7">
          <form onSubmit={onSubmit} className="glass rounded-[1.35rem] p-6 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm text-ink-300">
                Name
                <input
                  required
                  name="name"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-obsidian/60 px-4 py-3 text-mist outline-none ring-tuskegee-gold/40 focus:ring-2"
                />
              </label>
              <label className="block text-sm text-ink-300">
                Email
                <input
                  required
                  type="email"
                  name="email"
                  className="mt-2 w-full rounded-xl border border-white/10 bg-obsidian/60 px-4 py-3 text-mist outline-none ring-tuskegee-gold/40 focus:ring-2"
                />
              </label>
            </div>

            <label className="mt-4 block text-sm text-ink-300">
              Reason
              <select
                name="reason"
                required
                defaultValue=""
                className="mt-2 w-full rounded-xl border border-white/10 bg-obsidian/60 px-4 py-3 text-mist outline-none ring-tuskegee-gold/40 focus:ring-2"
              >
                <option value="" disabled>
                  Select a reason
                </option>
                {contactReasons.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>

            <label className="mt-4 block text-sm text-ink-300">
              Message
              <textarea
                required
                name="message"
                rows={5}
                className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-obsidian/60 px-4 py-3 text-mist outline-none ring-tuskegee-gold/40 focus:ring-2"
              />
            </label>

            <button
              type="submit"
              disabled={status === "sending"}
              className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-tuskegee-gold px-6 py-3 text-sm font-medium text-obsidian transition hover:bg-tuskegee-bright disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : status === "sent" ? "Message sent" : "Send message"}
            </button>
            {status === "error" && (
              <p className="mt-3 text-sm text-red-300">
                Something went wrong. Email me directly at {site.email}.
              </p>
            )}
            {status === "sent" && (
              <p className="mt-3 text-sm text-tuskegee-gold">Thank you — I&apos;ll get back to you soon.</p>
            )}
          </form>
        </Reveal>
      </div>
    </Section>
  );
}
