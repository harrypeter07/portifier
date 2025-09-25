import { componentMap, isFullPageTemplate } from "@/data/componentMap";
import { motion } from "framer-motion";

const SECTION_ORDER = [
  "hero",
  "about",
  "experience",
  "education",
  "skills",
  "projects",
  "achievements",
  "contact"
];

export default function Preview({ layout = {}, content = {}, portfolioData = null, currentTemplate = null }) {
  console.log("👁️ [PREVIEW] Component received props:", {
    hasLayout: !!layout,
    layoutKeys: layout ? Object.keys(layout) : [],
    hasContent: !!content,
    contentKeys: content ? Object.keys(content) : [],
    hasPortfolioData: !!portfolioData,
    portfolioDataKeys: portfolioData ? Object.keys(portfolioData) : [],
    currentTemplate: currentTemplate?.id,
    templateType: currentTemplate?.type,
    personalData: portfolioData?.personal ? {
      firstName: portfolioData.personal.firstName,
      lastName: portfolioData.personal.lastName,
      subtitle: portfolioData.personal.subtitle,
      email: portfolioData.personal.email
    } : null
  });

  // Handle full-page templates
  if (currentTemplate?.type === "full" && currentTemplate?.component) {
    const FullTemplateComponent = componentMap[currentTemplate.component];
    if (FullTemplateComponent) {
      console.log("👁️ [PREVIEW] Rendering full-page template:", currentTemplate.component);
      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden"
        >
          <FullTemplateComponent data={portfolioData || content} />
        </motion.div>
      );
    }
  }

  // Handle component-based templates (existing logic)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden"
    >
      {SECTION_ORDER.map((section) => {
        const safeLayout = layout || {};
        const componentName = safeLayout[section];
        if (!componentName) return null;
        console.log(`👁️ [PREVIEW] Rendering section: ${section} with component: ${componentName}`);
        
        const Component = componentMap[componentName];
        if (!Component) return null;

        let componentProps = {};
        // For hero section, always pass personal data for subtitle/tagline
        if (section === "hero") {
          componentProps = portfolioData && portfolioData.personal
            ? { data: { personal: portfolioData.personal } }
            : content && content.hero
            ? { data: { personal: content.hero } }
            : {};
          
          console.log("👁️ [PREVIEW] Hero section props:", {
            hasPortfolioData: !!portfolioData?.personal,
            hasContent: !!content?.hero,
            componentProps,
            personalData: componentProps.data?.personal ? {
              firstName: componentProps.data.personal.firstName,
              lastName: componentProps.data.personal.lastName,
              subtitle: componentProps.data.personal.subtitle,
              tagline: componentProps.data.personal.tagline
            } : null
          });
        }
        // For about section
        else if (section === "about") {
          componentProps = {
            summary: portfolioData?.about?.summary || content?.about?.summary || "",
            data: portfolioData || content,
          };
        }
        // For projects section
        else if (section === "projects") {
          componentProps = {
            items: portfolioData?.projects?.items || content?.projects?.items || [],
            data: portfolioData || content,
          };
        }
        // For skills section
        else if (section === "skills") {
          componentProps = {
            technical: portfolioData?.skills?.technical || content?.skills?.technical || [],
            soft: portfolioData?.skills?.soft || content?.skills?.soft || [],
            languages: portfolioData?.skills?.languages || content?.skills?.languages || [],
            data: portfolioData || content,
          };
        }
        // For achievements section
        else if (section === "achievements") {
          const toStringArr = arr => (Array.isArray(arr) ? arr.map(item => typeof item === 'string' ? item : (item.title || item.name || item.id || JSON.stringify(item))) : []);
          const awardsArr = toStringArr(portfolioData?.achievements?.awards || content?.achievements?.awards);
          const certsArr = toStringArr(portfolioData?.achievements?.certifications || content?.achievements?.certifications);
          const pubsArr = toStringArr(portfolioData?.achievements?.publications || content?.achievements?.publications);
          componentProps = {
            awards: awardsArr,
            certifications: certsArr,
            publications: pubsArr,
            data: portfolioData || content,
          };
        }
        // For experience section
        else if (section === "experience") {
          componentProps = {
            jobs: portfolioData?.experience?.jobs || content?.experience?.jobs || [],
            data: portfolioData || content,
          };
        }
        // For education section
        else if (section === "education") {
          componentProps = {
            degrees: portfolioData?.education?.degrees || content?.education?.degrees || [],
            data: portfolioData || content,
          };
        }
        // For contact section
        else if (section === "contact") {
          componentProps = {
            email: portfolioData?.personal?.email || portfolioData?.contact?.email || content?.contact?.email || "",
            phone: portfolioData?.personal?.phone || portfolioData?.contact?.phone || content?.contact?.phone || "",
            linkedin: portfolioData?.personal?.social?.linkedin || content?.contact?.linkedin || "",
            data: portfolioData || content,
          };
        }
        return (
          <motion.div
            key={section}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="border-b border-gray-200 dark:border-gray-700 last:border-b-0"
          >
            <Component {...componentProps} />
          </motion.div>
        );
      })}
    </motion.div>
  );
}