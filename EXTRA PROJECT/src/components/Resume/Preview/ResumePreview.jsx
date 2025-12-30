import { useResume } from "../../../context/ResumeContext";

export default function ResumePreview() {
  const { resumeData } = useResume();
  const { achievements } = resumeData;

  return (
    <div>
      {achievements?.length > 0 && (
        <>
          <h4>Achievements</h4>
          <ul>
            {achievements.map((a) => (
              <li key={a.id}>{a.title}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
