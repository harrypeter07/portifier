import React from 'react';
import DateRange from "../../../../utility/DateRange";
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const WorkExperience = ({item, index, id}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });
  
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
        <p className="content i-bold">{item.company}</p>
        <DateRange
          startYear={item.startYear}
          endYear={item.endYear}
          id={`work-experience-start-end-date`}
        />
      </div>
      <p className="content">{item.position}</p>
      <p className="content hyphens-auto">{item.description}</p>

      <ul className="list-disc ul-padding content">
        {typeof item.keyAchievements === "string" &&
          item.keyAchievements
            .split("\n")
            .map((achievement, subIndex) => (
              <li
                key={`${item.company}-${index}-${subIndex}`}
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

export default WorkExperience;