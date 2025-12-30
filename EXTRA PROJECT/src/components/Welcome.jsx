import { ResumeProvider } from "../context/ResumeContext";
import ResumeEditor from "./resume/ResumeEditor";
import ResumePreview from "./resume/preview/ResumePreview";

export default function Welcome({ user, onLogout }) {
  return (
    <ResumeProvider>
      <div className="resume-container">
        <div className="resume-left">
          <ResumeEditor user={user} onLogout={onLogout} />
        </div>

        <div className="resume-right">
          <ResumePreview />
        </div>
      </div>
    </ResumeProvider>
  );
}
