import { createContext, useContext, useState } from "react";
import { v4 as uuid } from "uuid";

const ResumeContext = createContext();

export const ResumeProvider = ({ children }) => {
  const [resumeData, setResumeData] = useState({
    achievements: []
  });

  // ➕ Add
  const addAchievement = () => {
    setResumeData((prev) => ({
      ...prev,
      achievements: [
        ...prev.achievements,
        { id: uuid(), title: "" }
      ]
    }));
  };

  // ✏️ Update
  const updateAchievement = (id, field, value) => {
    setResumeData((prev) => ({
      ...prev,
      achievements: prev.achievements.map((ach) =>
        ach.id === id ? { ...ach, [field]: value } : ach
      )
    }));
  };

  // 🗑 Remove
  const removeAchievement = (id) => {
    setResumeData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((ach) => ach.id !== id)
    }));
  };

  return (
    <ResumeContext.Provider
      value={{
        resumeData,
        addAchievement,
        updateAchievement,
        removeAchievement
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
};

// custom hook
export const useResume = () => useContext(ResumeContext);
