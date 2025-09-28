import React, {useContext} from 'react';
import {ResumeContext} from "../../../../builder";
import WorkExperience from "../components/WorkExperience";
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

const WorkExperiences = () => {
  const {resumeData} = useContext(ResumeContext);

  return (
    <div>
      <h2
        className="section-title mb-1 border-b-2 border-gray-300 editable"
        contentEditable
        suppressContentEditableWarning
      >
        Work Experience
      </h2>
      <SortableContext 
        items={resumeData.workExperience.map((_, index) => `work-experience-${index}`)}
        strategy={verticalListSortingStrategy}
      >
        {resumeData.workExperience.map((item, index) => (
          <WorkExperience
            key={`work-experience-${index}`}
            item={item}
            index={index}
            id={`work-experience-${index}`}
          />
        ))}
      </SortableContext>
    </div>
  );
};

export default WorkExperiences;
