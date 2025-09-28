import React, {useContext} from 'react';
import DateRange from "../../../../utility/DateRange";
import Link from "next/link";
import {ResumeContext} from "../../../../builder";
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const ProjectItem = ({item, index}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: `project-${index}` });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`mb-1 ${
        isDragging &&
        "outline-dashed outline-2 outline-gray-400 bg-white"
      }`}
    >
      <div className="flex flex-row justify-between space-y-1">
        <p className="content i-bold">{item.name}</p>
        <DateRange
          startYear={item.startYear}
          endYear={item.endYear}
          id={`project-start-end-date`}
        />
      </div>
      <p className="content">{item.description}</p>
      {item.link && (
        <Link
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="content text-blue-600 hover:text-blue-800 underline"
        >
          View Project
        </Link>
      )}
      <ul className="list-disc ul-padding content">
        {typeof item.keyAchievements === "string" &&
          item.keyAchievements
            .split("\n")
            .map((achievement, subIndex) => (
              <li
                key={`${item.name}-${index}-${subIndex}`}
                className="hover:outline-dashed hover:outline-2 hover:outline-gray-400"
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: achievement,
                  }}
                  contentEditable
                />
              </li>
            ))}
      </ul>
    </div>
  );
};

const Projects = () => {
  const {resumeData} = useContext(ResumeContext);
  
  return (
    <div>
      <h2
        className="section-title mb-1 border-b-2 border-gray-300 editable"
        contentEditable
        suppressContentEditableWarning
      >
        Projects
      </h2>
      <SortableContext 
        items={resumeData.projects.map((_, index) => `project-${index}`)}
        strategy={verticalListSortingStrategy}
      >
        {resumeData.projects.map((item, index) => (
          <ProjectItem
            key={`project-${index}`}
            item={item}
            index={index}
          />
        ))}
      </SortableContext>
    </div>
  );
};

export default Projects;