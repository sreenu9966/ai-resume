export default function Skills({ resumeData, setResumeData }) {
  const handleChange = (e) => {
    setResumeData({
      ...resumeData,
      skills: e.target.value.split(",")
    });
  };

  return (
    <>
      <h4>Skills</h4>
      <input placeholder="Java, React, Node" onChange={handleChange} />
    </>
  );
}
