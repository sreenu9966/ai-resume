export default function Education({ resumeData, setResumeData }) {
  const addEducation = () => {
    setResumeData({
      ...resumeData,
      education: [...resumeData.education, { college: "", degree: "", year: "" }]
    });
  };

  return (
    <>
      <h4>Education</h4>
      <button onClick={addEducation}>+ Add</button>
    </>
  );
}
