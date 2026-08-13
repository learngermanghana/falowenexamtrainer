import React from "react";
import B2KnowledgeChoicePractice from "./B2KnowledgeChoicePractice";
import B2TopicCollocationPractice from "./B2TopicCollocationPractice";

export default function B2KnowledgeChoiceWithCollocations(props) {
  return <><B2TopicCollocationPractice day={Number(props?.lesson?.day || 0)} /><B2KnowledgeChoicePractice {...props} /></>;
}
