import Link from "next/link";
import React from "react";

export const Footer = ({ data }: { data: any }) => {
  const personal = data?.personal || {};
  const contact = data?.contact || {};
  const social = (data?.personal?.social as any) || data?.social || {};
  
  const fullName = personal.firstName && personal.lastName ? `${personal.firstName} ${personal.lastName}` : (personal.title || "Portfolio");
  
  // Create footer data from portfolio data
  const footerData = [
    {
      title: "Contact",
      data: [
        { name: "Email", link: `mailto:${contact.email || "#"}`, icon: "📧" },
        { name: "Phone", link: `tel:${contact.phone || "#"}`, icon: "📞" },
        { name: "Location", link: "#", icon: "📍" }
      ]
    },
    {
      title: "Social",
      data: [
        { name: "GitHub", link: social.github || "#", icon: "🐙" },
        { name: "LinkedIn", link: social.linkedin || "#", icon: "💼" },
        { name: "Twitter", link: social.twitter || "#", icon: "🐦" }
      ]
    }
  ];
  return (
    <div className="w-full h-full bg-transparent text-gray-200 shadow-lg p-[15px]">
      <div className="flex flex-col justify-center items-center m-auto w-full">
        {/* Top row: Contact left, Social right (wrap on md+) */}
        <div className="flex w-full items-start justify-between gap-4 flex-col md:flex-row">
          {/* Contact */}
          <div className="w-full md:w-1/2 flex flex-col items-start md:items-start">
            <h3 className="font-bold text-[16px] mb-2">Contact</h3>
            <div className="flex flex-col md:flex-row md:flex-wrap md:gap-6">
              {footerData[0].data.map(({ icon, name, link }) => (
                <Link
                  key={`contact-${name}`}
                  href={link}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex flex-row items-center my-[8px] md:my-0"
                >
                  <span className="text-[18px] mr-[6px]">{icon}</span>
                  <span className="text-[14px]">{name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Social icons one line, RTL on mobile */}
          <div className="w-full md:w-1/2 flex md:justify-end">
            <div className="w-full md:w-auto flex flex-row-reverse md:flex-row items-center justify-between md:justify-end gap-4 border-[rgba(112,66,248,0.25)] bg-[rgba(3,0,20,0.25)] px-3 py-2 rounded-full">
              {footerData[1].data.map(({ icon, name, link }) => (
                <Link
                  key={`social-${name}`}
                  href={link}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-[18px] md:text-[20px]"
                  aria-label={name}
                >
                  {icon}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 text-[13px] md:text-[15px] text-center">
          &copy; {fullName} {new Date().getFullYear()}. All rights reserved.
        </div>
      </div>
    </div>
  );
};
