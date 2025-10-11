import Link from "next/link";

export const Footer = ({ data }: { data: any }) => {
  const personal = data?.personal || {};
  const contact = data?.contact || {};
  const social = data?.social || {};
  
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
      <div className="w-full flex flex-col items-center justify-center m-auto">
        <div className="w-full h-full flex flex-row items-center justify-around flex-wrap">
          {footerData.map((column) => (
            <div
              key={column.title}
              className="min-w-[200px] h-auto flex flex-col items-center justify-start"
            >
              <h3 className="font-bold text-[16px]">{column.title}</h3>
              {column.data.map(({ icon, name, link }) => (
                <Link
                  key={`${column.title}-${name}`}
                  href={link}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex flex-row items-center my-[15px]"
                >
                  <span className="text-[20px] mr-[6px]">{icon}</span>
                  <span className="text-[15px]">{name}</span>
                </Link>
              ))}
            </div>
          ))}
        </div>

        <div className="mb-[20px] text-[15px] text-center">
          &copy; {fullName} {new Date().getFullYear()}. All rights reserved.
        </div>
      </div>
    </div>
  );
};
