export default function PersonalInfo({ resumeData, setResumeData }) {
  const { personal } = resumeData;

  const handleChange = (e) => {
    setResumeData({
      ...resumeData,
      personal: {
        ...personal,
        [e.target.name]: e.target.value
      }
    });
  };

  return (
    <>
      <h4>Personal Info</h4>

      <input name="name" placeholder="Full Name" value={personal.name} onChange={handleChange} />
      <input name="email" placeholder="Email" value={personal.email} onChange={handleChange} />
      <input name="phone" placeholder="Phone" value={personal.phone} onChange={handleChange} />
      <textarea name="summary" placeholder="Summary" value={personal.summary} onChange={handleChange} />
    </>
  );
}
