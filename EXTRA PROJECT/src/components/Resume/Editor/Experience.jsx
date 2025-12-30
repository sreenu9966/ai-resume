export default function Experience({ resumeData, setResumeData }) {
  const addExperience = () => {
    setResumeData({
      ...resumeData,
      experience: [...resumeData.experience, { company: "", role: "", duration: "" }]
    });
  };

  return (
    <>
      <h4>Experience</h4>
      <button onClick={addExperience}>+ Add</button>
    </>
  );
}
