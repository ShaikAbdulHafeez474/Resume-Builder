import useStore from "../store/useStore";

const ResumePreview = () => {
  const { resume } = useStore();

  return (
    <div className="p-6 border rounded-lg shadow bg-white">
      <h1 className="text-2xl font-bold">{resume.name || "Your Name"}</h1>
      <p>
        {resume.email || "you@example.com"} | {resume.phone || "123-456-7890"}
      </p>

      <h2 className="text-xl font-semibold mt-4">Education</h2>
      <ul className="list-disc ml-6">
        {resume.education.length > 0
          ? resume.education.map((item, i) => <li key={i}>{item}</li>)
          : <li>Add your education details here.</li>}
      </ul>

      <h2 className="text-xl font-semibold mt-4">Experience</h2>
      <ul className="list-disc ml-6">
        {resume.experience.length > 0
          ? resume.experience.map((item, i) => <li key={i}>{item}</li>)
          : <li>Add your work experience here.</li>}
      </ul>

      <h2 className="text-xl font-semibold mt-4">Projects</h2>
      <ul className="list-disc ml-6">
        {resume.projects.length > 0
          ? resume.projects.map((item, i) => <li key={i}>{item}</li>)
          : <li>Add your projects here.</li>}
      </ul>

      <h2 className="text-xl font-semibold mt-4">Skills</h2>
      <ul className="list-disc ml-6">
        {resume.skills.length > 0
          ? resume.skills.map((item, i) => <li key={i}>{item}</li>)
          : <li>List your skills here.</li>}
      </ul>

      <h2 className="text-xl font-semibold mt-4">Achievements</h2>
      <ul className="list-disc ml-6">
        {resume.achievements.length > 0
          ? resume.achievements.map((item, i) => <li key={i}>{item}</li>)
          : <li>Highlight your key achievements here.</li>}
      </ul>
    </div>
  );
};

export default ResumePreview;
