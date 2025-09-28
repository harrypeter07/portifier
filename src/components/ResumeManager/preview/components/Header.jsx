import Image from "next/image";
import ContactInfo from "../components/ContactInfo";
import { MdPhone, MdEmail, MdLocationOn } from "react-icons/md";
import React from 'react';

const Header = ({ resumeData, icons }) => {
  // Get colors from resumeData or use defaults
  const colors = resumeData.colors || {
    primary: '#9333ea',
    secondary: '#f0f9ff',
    text: '#1e3a8a',
    background: '#ffffff',
    accent: '#3b82f6'
  };

  // Get header styles based on template style
  const getHeaderStyles = () => {
    const baseStyle = "f-col mb-1";
    
    switch(resumeData.templateStyle) {
      case 'modern':
        return `${baseStyle} items-center p-4 rounded-t`;
      case 'minimal':
        return `${baseStyle} items-start border-b-2 pb-4`;
      case 'creative':
        return `${baseStyle} items-center border-b-4 pb-4`;
      case 'single-column':
        return `${baseStyle} items-center mb-4 border-b pb-4`;
      case 'minimal-color':
        return `${baseStyle} items-center mb-4 p-4 rounded-t`;
      case 'classic':
      default:
        return `${baseStyle} items-center`;
    }
  };
  
  // Get inline styles for header based on colors
  const getHeaderInlineStyles = () => {
    switch(resumeData.templateStyle) {
      case 'modern':
        return { backgroundColor: colors.secondary };
      case 'minimal':
        return { borderColor: colors.primary };
      case 'creative':
        return { borderColor: colors.primary };
      case 'single-column':
        return { borderColor: colors.primary };
      case 'minimal-color':
        return { 
          backgroundColor: colors.secondary,
          color: colors.text
        };
      case 'classic':
      default:
        return {};
    }
  };

  return (
    <div className={getHeaderStyles()} style={getHeaderInlineStyles()}>
      {resumeData.profilePicture.length > 0 && (
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-fuchsia-700">
          <Image
            src={resumeData.profilePicture}
            alt="profile"
            width={100}
            height={100}
            className="object-cover h-full w-full"
          />
        </div>
      )}

      <h1 className="name">{resumeData.name}</h1>
      <p className="profession">{resumeData.position}</p>

      <ContactInfo
        mainclass="flex flex-row gap-1 mb-1 contact"
        linkclass="inline-flex items-center gap-1"
        teldata={resumeData.contactInformation}
        emaildata={resumeData.email}
        addressdata={resumeData.address}
        telicon={<MdPhone />}
        emailicon={<MdEmail />}
        addressicon={<MdLocationOn />}
      />

      <div className="grid grid-cols-3 gap-1">
        {resumeData.socialMedia.map((socialMedia, index) => {
          return (
            <a
              href={`http://${socialMedia.link}`}
              aria-label={socialMedia.socialMedia}
              key={index}
              title={socialMedia.socialMedia}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 social-media align-center justify-center "
            >
              {icons.map((icon, index) => {
                if (icon.name === socialMedia.socialMedia.toLowerCase()) {
                  return <span key={index}>{icon.icon}</span>;
                }
              })}
              {socialMedia.link}
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default Header;
