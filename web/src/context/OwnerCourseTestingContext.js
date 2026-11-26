import {createContext,useContext} from "react";
// Only the AppShell's verified owner testing controls provide a selection.
export const OwnerCourseTestingContext = createContext(null);
export const useOwnerCourseTesting = () => useContext(OwnerCourseTestingContext);
