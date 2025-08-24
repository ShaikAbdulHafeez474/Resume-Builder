import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Save, 
  Download, 
  Eye, 
  Sparkles, 
  Plus, 
  Trash2, 
  Clock,
  ArrowLeft,
  Loader2
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { toast } from "sonner";
import Navbar from "../components/Navbar";
import ResumePreview from "../components/ResumePreview";
import api from "../utils/api";
import useStore from "../store/useStore";

const ListEditor = ({ label, field, placeholder }) => {
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
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{label}</CardTitle>
          <Button size="sm" onClick={addItem} variant="outline">
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {list.length === 0 && (
          <p className="text-sm text-slate-500 italic">
            No {label.toLowerCase()} added yet. Click "Add" to get started.
          </p>
        )}
        {list.map((item, i) => (
          <div key={i} className="flex gap-2">
            <Textarea
              value={item}
              onChange={(e) => handleChange(i, e.target.value)}
              placeholder={placeholder || `Enter ${label.toLowerCase()} details...`}
              className="flex-1 min-h-[60px] resize-none focus-ring"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => removeItem(i)}
              className="shrink-0 h-fit text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const AIAssistant = ({ field, currentContent, onSuggestion }) => {
  const [loading, setLoading] = useState(false);

  const getSuggestion = async () => {
    setLoading(true);
    try {
      let endpoint = '';
      let payload = {};

      if (field === 'summary') {
        endpoint = '/ai/improve-summary';
        payload = { summary: currentContent };
      } else if (field === 'skills') {
        endpoint = '/ai/generate-skills';
        payload = { currentSkills: currentContent };
      }

      const response = await api.post(endpoint, payload);
      onSuggestion(response.data.suggestion || response.data.skills);
      toast.success("AI suggestion generated!");
    } catch (err) {
      console.error('AI suggestion failed:', err);
      toast.error("Failed to generate AI suggestion. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={getSuggestion}
      disabled={loading}
      className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200 hover:from-purple-100 hover:to-blue-100"
    >
      {loading ? (
        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
      ) : (
        <Sparkles className="h-4 w-4 mr-1" />
      )}
      AI Suggest
    </Button>
  );
};

const ResumeEditor = () => {
  const { resume, updateResumeField, updateResumeList, setResume } = useStore();
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const queryClient = useQueryClient();

  // Fetch existing resume data
  const { data: existingResume, isLoading } = useQuery({
    queryKey: ['resume'],
    queryFn: async () => {
      const response = await api.get('/resume');
      return response.data;
    },
  });

  // Load existing resume into store
  useEffect(() => {
    if (existingResume && Object.keys(existingResume).length > 0) {
      setResume(existingResume);
    }
  }, [existingResume, setResume]);

  // Save resume mutation
  const saveResumeMutation = useMutation({
    mutationFn: async (resumeData) => {
      const response = await api.post('/resume', resumeData);
      return response.data;
    },
    onSuccess: () => {
      setLastSaved(new Date());
      queryClient.invalidateQueries(['resume']);
      toast.success("Resume saved successfully!");
    },
    onError: (error) => {
      console.error('Save failed:', error);
      toast.error("Failed to save resume. Please try again.");
    },
  });

  // Update resume mutation
  const updateResumeMutation = useMutation({
    mutationFn: async (resumeData) => {
      const response = await api.put('/resume', resumeData);
      return response.data;
    },
    onSuccess: () => {
      setLastSaved(new Date());
      queryClient.invalidateQueries(['resume']);
      toast.success("Resume updated successfully!");
    },
    onError: (error) => {
      console.error('Update failed:', error);
      toast.error("Failed to update resume. Please try again.");
    },
  });

  const handleSave = () => {
    if (existingResume && Object.keys(existingResume).length > 0) {
      updateResumeMutation.mutate(resume);
    } else {
      saveResumeMutation.mutate(resume);
    }
  };

  const handleAISuggestion = (field, suggestion) => {
    if (field === 'skills' && Array.isArray(suggestion)) {
      updateResumeList('skills', suggestion);
    } else {
      updateResumeField(field, suggestion);
    }
  };

  const downloadPDF = async () => {
    try {
      const response = await api.post('/template/render', {
        resume,
        templateId: 'default'
      }, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${resume.name || 'resume'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Resume downloaded!");
    } catch (err) {
      console.error('Download failed:', err);
      toast.error("Failed to download resume. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div>
        <Navbar />
        <div className="max-w-7xl mx-auto p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-slate-200 rounded"></div>
                ))}
              </div>
              <div className="h-96 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => window.history.back()}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Resume Editor</h1>
              {lastSaved && (
                <p className="text-sm text-slate-600 flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3" />
                  Last saved {lastSaved.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => setIsPreviewMode(!isPreviewMode)}
              className="hidden lg:flex"
            >
              <Eye className="h-4 w-4 mr-2" />
              {isPreviewMode ? 'Edit' : 'Preview'}
            </Button>
            <Button variant="outline" onClick={downloadPDF}>
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
            <Button 
              onClick={handleSave}
              disabled={saveResumeMutation.isPending || updateResumeMutation.isPending}
            >
              {(saveResumeMutation.isPending || updateResumeMutation.isPending) ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Resume
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Form */}
          <div className={`space-y-6 ${isPreviewMode ? 'hidden lg:block' : ''}`}>
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={resume.name || ''}
                      onChange={(e) => updateResumeField("name", e.target.value)}
                      placeholder="Your full name"
                      className="focus-ring"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={resume.email || ''}
                      onChange={(e) => updateResumeField("email", e.target.value)}
                      placeholder="your.email@example.com"
                      className="focus-ring"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={resume.phone || ''}
                      onChange={(e) => updateResumeField("phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                      className="focus-ring"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={resume.location || ''}
                      onChange={(e) => updateResumeField("location", e.target.value)}
                      placeholder="City, State"
                      className="focus-ring"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Summary */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Professional Summary</CardTitle>
                  <AIAssistant
                    field="summary"
                    currentContent={resume.summary}
                    onSuggestion={(suggestion) => handleAISuggestion('summary', suggestion)}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={resume.summary || ''}
                  onChange={(e) => updateResumeField("summary", e.target.value)}
                  placeholder="Write a compelling professional summary that highlights your key strengths and career objectives..."
                  className="min-h-[120px] focus-ring"
                />
              </CardContent>
            </Card>

            {/* Dynamic Sections */}
            <ListEditor
              label="Work Experience"
              field="experience"
              placeholder="Job Title at Company Name (Year - Year)
• Achievement or responsibility that demonstrates impact
• Quantified result or key accomplishment
• Relevant skill or technology used"
            />

            <ListEditor
              label="Education"
              field="education"
              placeholder="Degree Name - Institution Name (Year)
• Relevant coursework, GPA (if 3.5+), or honors
• Academic projects or achievements"
            />

            <ListEditor
              label="Projects"
              field="projects"
              placeholder="Project Name - Brief Description
• Technologies used and your role
• Key features implemented or problems solved
• Results or impact (users, performance, etc.)"
            />

            {/* Skills with AI */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Skills</CardTitle>
                  <AIAssistant
                    field="skills"
                    currentContent={resume.skills}
                    onSuggestion={(suggestion) => handleAISuggestion('skills', suggestion)}
                  />
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {(resume.skills || []).length === 0 && (
                  <p className="text-sm text-slate-500 italic">
                    No skills added yet. Use AI suggestions or add manually.
                  </p>
                )}
                <div className="flex flex-wrap gap-2">
                  {(resume.skills || []).map((skill, i) => (
                    <Badge key={i} variant="secondary" className="flex items-center gap-1">
                      {skill}
                      <button
                        onClick={() => {
                          const updated = resume.skills.filter((_, index) => index !== i);
                          updateResumeList('skills', updated);
                        }}
                        className="ml-1 text-slate-500 hover:text-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a skill..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        updateResumeList('skills', [...(resume.skills || []), e.target.value.trim()]);
                        e.target.value = '';
                      }
                    }}
                    className="focus-ring"
                  />
                  <Button
                    size="sm"
                    onClick={(e) => {
                      const input = e.target.parentElement.querySelector('input');
                      if (input.value.trim()) {
                        updateResumeList('skills', [...(resume.skills || []), input.value.trim()]);
                        input.value = '';
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>

            <ListEditor
              label="Achievements & Certifications"
              field="achievements"
              placeholder="Achievement or Certification Name (Year)
• Brief description or significance
• Issuing organization (for certifications)"
            />
          </div>

          {/* Right Side - Live Preview */}
          <div className={`${isPreviewMode ? 'col-span-full' : ''}`}>
            <div className="sticky top-24">
              <ResumePreview />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeEditor;