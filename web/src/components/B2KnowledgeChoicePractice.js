import React from "react";
import B2KnowledgeChoiceCore from "./B2KnowledgeChoiceCore";
import B2TopicCollocationPractice from "./B2TopicCollocationPractice";

export default function B2KnowledgeChoicePractice(props) {
  return <><B2TopicCollocationPractice day={Number(props?.lesson?.day || 0)} /><B2KnowledgeChoiceCore {...props} /></>;
}
