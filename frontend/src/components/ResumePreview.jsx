import { Mail, Phone, MapPin} from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import useStore from "../store/useStore";

const ResumePreview = () => {
  const { resume } = useStore();

  const SectionTitle = ({ children, className = "" }) => (
    <h2 className={`text-lg font-semibold text-slate-800 border-b border-slate-200 pb-2 mb-3 ${className}`}>
      {children}
    </h2>
  );

  const ContactItem = ({ icon: Icon, children }) => (
    <div className="flex items-center gap-2 text-sm text-slate-600">
      <Icon className="h-4 w-4 shrink-0" />
      <span>{children}</span>
    </div>
  );

  return (
    <Card className="shadow-lg print:shadow-none print:border-none bg-white">
      <CardContent className="p-8 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-slate-900">
            {resume.name || "Your Name"}
          </h1>
          
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            {resume.email && (
              <ContactItem icon={Mail}>
                {resume.email}
              </ContactItem>
            )}
            {resume.phone && (
              <ContactItem icon={Phone}>
                {resume.phone}
              </ContactItem>
            )}
            {resume.location && (
              <ContactItem icon={MapPin}>
                {resume.location}
              </ContactItem>
            )}
          </div>
        </div>

        {/* Professional Summary */}
        {resume.summary && (
          <div>
            <SectionTitle>Professional Summary</SectionTitle>
            <p className="text-slate-700 leading-relaxed">
              {resume.summary}
            </p>
          </div>
        )}

        {/* Skills */}
        {resume.skills && resume.skills.length > 0 && (
          <div>
            <SectionTitle>Skills</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {resume.skills.map((skill, i) => (
                <Badge key={i} variant="secondary" className="bg-slate-100 text-slate-700 hover:bg-slate-200">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Work Experience */}
        {resume.experience && resume.experience.length > 0 && (
          <div>
            <SectionTitle>Work Experience</SectionTitle>
            <div className="space-y-4">
              {resume.experience.map((exp, i) => (
                <div key={i} className="space-y-2">
                  <div className="whitespace-pre-line text-slate-700 leading-relaxed">
                    {exp}
                  </div>
                  {i < resume.experience.length - 1 && <Separator className="my-3" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {resume.projects && resume.projects.length > 0 && (
          <div>
            <SectionTitle>Projects</SectionTitle>
            <div className="space-y-4">
              {resume.projects.map((project, i) => (
                <div key={i} className="space-y-2">
                  <div className="whitespace-pre-line text-slate-700 leading-relaxed">
                    {project}
                  </div>
                  {i < resume.projects.length - 1 && <Separator className="my-3" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {resume.education && resume.education.length > 0 && (
          <div>
            <SectionTitle>Education</SectionTitle>
            <div className="space-y-4">
              {resume.education.map((edu, i) => (
                <div key={i} className="space-y-2">
                  <div className="whitespace-pre-line text-slate-700 leading-relaxed">
                    {edu}
                  </div>
                  {i < resume.education.length - 1 && <Separator className="my-3" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Achievements */}
        {resume.achievements && resume.achievements.length > 0 && (
          <div>
            <SectionTitle>Achievements & Certifications</SectionTitle>
            <div className="space-y-4">
              {resume.achievements.map((achievement, i) => (
                <div key={i} className="space-y-2">
                  <div className="whitespace-pre-line text-slate-700 leading-relaxed">
                    {achievement}
                  </div>
                  {i < resume.achievements.length - 1 && <Separator className="my-3" />}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {(!resume.name && !resume.email && !resume.summary) && (
          <div className="text-center py-12 text-slate-500">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-slate-700 mb-2">Resume Preview</h3>
                <p className="text-sm">
                  Start filling out the form on the left to see your resume come to life!
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResumePreview;