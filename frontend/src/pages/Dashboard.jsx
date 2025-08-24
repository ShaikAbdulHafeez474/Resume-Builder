import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  FileText, 
  Plus, 
  Layout, 
  BarChart3, 
  Clock, 
  Download,
  Edit,
  Trash2,
  Eye
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { Alert, AlertDescription } from "../components/ui/alert";
import Navbar from "../components/Navbar";
import api from "../utils/api";
import useStore from "../store/useStore";

const Dashboard = () => {
  const { user } = useStore();
  const [stats, setStats] = useState({
    totalResumes: 0,
    templatesUsed: 0,
    totalViews: 0,
    lastActivity: null
  });

  // Fetch user's resumes
  const { data: resumes, isLoading, error } = useQuery({
    queryKey: ['resumes'],
    queryFn: async () => {
      const response = await api.get('/resume');
      return response.data;
    },
  });

  // Fetch analytics data
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Mock stats for now since analytics service is minimal
        setStats({
          totalResumes: resumes?.length || 0,
          templatesUsed: 3,
          totalViews: 127,
          lastActivity: new Date().toISOString()
        });
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      }
    };

    if (resumes) {
      fetchStats();
    }
  }, [resumes]);

  const StatCard = ({ title, value, description, color = "blue" }) => {
    const colorClasses = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      purple: "from-purple-500 to-purple-600",
      orange: "from-orange-500 to-orange-600"
    };

    return (
      <Card className="card-hover">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-600">{title}</CardTitle>
          <div className={`p-2 rounded-lg bg-gradient-to-r ${colorClasses[color]}`}>
            <Icon className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
          <p className="text-xs text-slate-600 mt-1">{description}</p>
        </CardContent>
      </Card>
    );
  };

  const ResumeCard = ({ resume, onDelete, onEdit }) => (
    <Card className="card-hover">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{resume.name || 'Untitled Resume'}</CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Clock className="h-3 w-3" />
              Last updated {new Date(resume.updatedAt || Date.now()).toLocaleDateString()}
            </CardDescription>
          </div>
          <Badge variant="secondary" className="bg-green-50 text-green-700">
            v{resume.version || 1}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => onEdit(resume)}>
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
            <Button size="sm" variant="outline">
              <Eye className="h-3 w-3 mr-1" />
              Preview
            </Button>
            <Button size="sm" variant="outline">
              <Download className="h-3 w-3 mr-1" />
              PDF
            </Button>
          </div>
          <Button 
            size="sm" 
            variant="ghost" 
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={() => onDelete(resume)}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const handleEditResume = () => {
    // Load resume data into store and navigate to editor
    // This would be implemented with proper resume loading
    window.location.href = '/editor';
  };

  const handleDeleteResume = async (resume) => {
    // Implementation for deleting resume
    console.log('Delete resume:', resume);
  };

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Welcome Section */}
        <div className="animate-fade-in">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Welcome back, {user?.name?.split(' ')[0] || 'there'}! 👋
          </h1>
          <p className="text-slate-600 text-lg">
            Ready to craft your perfect resume? Let's get started.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Resumes"
            value={stats.totalResumes}
            description="Resumes created"
            icon={FileText}
            color="blue"
          />
          <StatCard
            title="Templates Used"
            value={stats.templatesUsed}
            description="Different templates"
            icon={Layout}
            color="green"
          />
          <StatCard
            title="Profile Views"
            value={stats.totalViews}
            description="Total views"
            icon={Eye}
            color="purple"
          />
          <StatCard
            title="This Month"
            value="12"
            description="Resume updates"
            icon={BarChart3}
            color="orange"
          />
        </div>

        {/* Quick Actions */}
        <Card className="border-dashed border-2 border-slate-200 hover:border-slate-300 transition-colors">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Create Your First Resume</h3>
            <p className="text-slate-600 text-center mb-6 max-w-md">
              Get started by creating a new resume or choosing from our professional templates.
            </p>
            <div className="flex gap-3">
              <Button asChild className="btn-hover">
                <Link to="/editor">
                  <FileText className="w-4 h-4 mr-2" />
                  Start from Scratch
                </Link>
              </Button>
              <Button variant="outline" asChild className="btn-hover">
                <Link to="/templates">
                  <Layout className="w-4 h-4 mr-2" />
                  Browse Templates
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Resumes */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Your Resumes</h2>
            <Button asChild>
              <Link to="/editor">
                <Plus className="w-4 h-4 mr-2" />
                New Resume
              </Link>
            </Button>
          </div>

          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-16" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>
                Failed to load your resumes. Please try again later.
              </AlertDescription>
            </Alert>
          )}

          {resumes && resumes.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No resumes yet</h3>
                <p className="text-slate-600 mb-4">Create your first resume to get started!</p>
                <Button asChild>
                  <Link to="/editor">Create Resume</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {resumes && resumes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((resume, index) => (
                <ResumeCard
                  key={resume.id || index}
                  resume={resume}
                  onEdit={handleEditResume}
                  onDelete={handleDeleteResume}
                />
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="card-hover">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">View Analytics</CardTitle>
                  <CardDescription>Track your resume performance</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" asChild className="w-full">
                <Link to="/analytics">Open Analytics</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Layout className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Browse Templates</CardTitle>
                  <CardDescription>Find the perfect design</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" asChild className="w-full">
                <Link to="/templates">Browse Templates</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="card-hover">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileText className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">Resume Tips</CardTitle>
                  <CardDescription>Learn best practices</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">
                View Tips
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;