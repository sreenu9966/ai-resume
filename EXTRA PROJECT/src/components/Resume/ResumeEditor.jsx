import { AchievementsForm } from "./editor/AchievementsForm";

export default function ResumeEditor({ onLogout }) {
  return (
    <>
      {/* other sections */}
      <AchievementsForm />
      {/* other sections */}
      

      <button onClick={onLogout}>Logout</button>
    </>
  );
}
