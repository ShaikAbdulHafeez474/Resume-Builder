import useStore from "../store/useStore";
import ResumePreview from "../components/ResumePreview";

const ListEditor = ({ label, field }) => {
  const { resume, updateResumeList } = useStore();
  const list = resume[field] || [];

  const handleChange = (index, value) => {
    const updated = [...list];
    updated[index] = value;
    updateResumeList(field, updated);
  };

  const addItem = () => updateResumeList(field, [...list, ""]);
  const removeItem = (index) =>
    updateResumeList(field, list.filter((_, i) => i !== index));

  return (
    <div className="mb-4">
      <h3 className="font-semibold">{label}</h3>
      {list.map((item, i) => (
        <div key={i} className="flex gap-2 mt-2">
          <input
            type="text"
            value={item}
            onChange={(e) => handleChange(i, e.target.value)}
            className="flex-1 p-2 border rounded-md"
          />
          <button
            onClick={() => removeItem(i)}
            className="bg-red-500 text-white px-2 rounded"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        onClick={addItem}
        className="bg-blue-500 text-white px-3 py-1 mt-2 rounded"
      >
        + Add {label} Item
      </button>
    </div>
  );
};

const ResumeEditor = () => {
  const { resume, updateResumeField } = useStore();

  return (
    <div className="grid grid-cols-2 gap-6 p-6">
      {/* Left side - Form */}
      <div className="space-y-4">
        <label className="block">
          Name:
          <input
            type="text"
            value={resume.name}
            onChange={(e) => updateResumeField("name", e.target.value)}
            className="w-full p-2 border rounded-md mt-1"
          />
        </label>

        <label className="block">
          Email:
          <input
            type="email"
            value={resume.email}
            onChange={(e) => updateResumeField("email", e.target.value)}
            className="w-full p-2 border rounded-md mt-1"
          />
        </label>

        <label className="block">
          Phone:
          <input
            type="text"
            value={resume.phone}
            onChange={(e) => updateResumeField("phone", e.target.value)}
            className="w-full p-2 border rounded-md mt-1"
          />
        </label>

        {/* Bullet List Sections */}
        <ListEditor label="Education" field="education" />
        <ListEditor label="Experience" field="experience" />
        <ListEditor label="Projects" field="projects" />    {/* ✅ added */}
        <ListEditor label="Skills" field="skills" />
        <ListEditor label="Achievements" field="achievements" />
      </div>

      {/* Right side - Live Preview */}
      <ResumePreview />
    </div>
  );
};

export default ResumeEditor;
