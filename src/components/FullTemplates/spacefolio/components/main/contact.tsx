import Link from "next/link";
import React from "react";

export const Contact = ({ data }: { data: any }) => {
  const contact = data?.contact || {};
  const social = (data?.personal?.social as any) || data?.social || {};

  const items = [
    contact?.email ? { name: "Email", value: contact.email, link: `mailto:${contact.email}` } : null,
    contact?.phone ? { name: "Phone", value: contact.phone, link: `tel:${contact.phone}` } : null,
  ].filter(Boolean) as { name: string; value: string; link: string }[];

  const socials = [
    social.github ? { name: "GitHub", link: social.github } : null,
    social.linkedin ? { name: "LinkedIn", link: social.linkedin } : null,
    social.twitter ? { name: "Twitter", link: social.twitter } : null,
  ].filter(Boolean) as { name: string; link: string }[];

  if (items.length === 0 && socials.length === 0) return null;

  return (
    <section id="contact" className="flex flex-col items-center justify-center w-full px-4 py-20">
      <h2 className="text-3xl md:text-4xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500 mb-6">
        Contact
      </h2>

      <div className="w-full max-w-3xl flex flex-col gap-4">
        {items.map((it) => (
          <Link key={it.name} href={it.link} className="text-gray-200 underline underline-offset-4">
            {it.name}: {it.value}
          </Link>
        ))}

        {socials.length > 0 ? (
          <div className="flex flex-row flex-wrap gap-4 mt-2">
            {socials.map((s) => (
              <Link key={s.name} href={s.link} target="_blank" rel="noreferrer noopener" className="text-gray-200">
                {s.name}
              </Link>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
};
