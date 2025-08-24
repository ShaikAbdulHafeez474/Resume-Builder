import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Eye, Download, ArrowLeft, Layout, Star, Clock } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import Navbar from "../components/Navbar";
import api from "../utils/api";
import useStore from "../store/useStore";

const TemplateSelector = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { setSelectedTemplate } = useStore();

  // Fetch templates
  const { data: templates, isLoading, error } = useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      const response = await api.get('/template');
      return response.data;
    },
  });

  // Mock template data in case backend doesn't have templates yet
  const mockTemplates = [
    {
      id: 'modern-1',
      name: 'Modern Professional',
      description: 'Clean and contemporary design perfect for tech professionals',
      category: 'modern',
      preview: '/api/templates/modern-1/preview.png',
      isPremium: false,
      rating: 4.8,
      downloads: 1240
    },
    {
      id: 'classic-1',
      name: 'Executive Classic',
      description: 'Traditional format ideal for senior executive positions',
      category: 'classic',
      preview: '/api/templates/classic-1/preview.png',
      isPremium: true,
      rating: 4.9,
      downloads: 890
    },
    {
      id: 'creative-1',
      name: 'Creative Designer',
      description: 'Eye-catching layout for creative professionals and designers',
      category: 'creative',
      preview: '/api/templates/creative-1/preview.png',
      isPremium: false,
      rating: 4.7,
      downloads: 1560
    },
    {
      id: 'minimal-1',
      name: 'Minimalist Pro',
      description: 'Simple and elegant design that focuses on content',
      category: 'minimal',
      preview: '/api/templates/minimal-1/preview.png',
      isPremium: false,
      rating: 4.6,
      downloads: 980
    },
    {
      id: 'modern-2',
      name: 'Tech Innovator',
      description: 'Modern template with tech-focused sections and skills highlight',
      category: 'modern',
      preview: '/api/templates/modern-2/preview.png',
      isPremium: true,
      rating: 4.8,
      downloads: 720
    },
    {
      id: 'academic-1',
      name: 'Academic Scholar',
      description: 'Comprehensive format for academic and research positions',
      category: 'academic',
      preview: '/api/templates/academic-1/preview.png',
      isPremium: false,
      rating: 4.5,
      downloads: 450
    }
  ];

  const displayTemplates = templates && templates.length > 0 ? templates : mockTemplates;

  // Filter templates
  const filteredTemplates = displayTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || template.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: 'all', label: 'All Templates' },
    { value: 'modern', label: 'Modern' },
    { value: 'classic', label: 'Classic' },
    { value: 'creative', label: 'Creative' },
    { value: 'minimal', label: 'Minimal' },
    { value: 'academic', label: 'Academic' }
  ];

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    // Navigate to editor with selected template
    window.location.href = '/editor';
  };

  const TemplateCard = ({ template }) => (
    <Card className="card-hover group">
      <div className="relative">
        {/* Template Preview */}
        <div className="aspect-[8.5/11] bg-gradient-to-br from-slate-100 to-slate-200 rounded-t-lg overflow-hidden">
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <Layout className="w-16 h-16" />
          </div>
          {template.isPremium && (
            <Badge className="absolute top-3 right-3 bg-gradient-to-r from-yellow-400 to-orange-500">
              <Star className="w-3 h-3 mr-1" />
              Premium
            </Badge>
          )}
        </div>
        
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-t-lg flex items-center justify-center gap-2">
          <Button size="sm" variant="secondary">
            <Eye className="w-4 h-4 mr-1" />
            Preview
          </Button>
          <Button 
            size="sm" 
            onClick={() => handleSelectTemplate(template)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Use Template
          </Button>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{template.name}</CardTitle>
            <CardDescription className="text-sm mt-1">
              {template.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between text-sm text-slate-600">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>{template.rating}</span>
            </div>
            <div className="flex items-center gap-1">
              <Download className="w-3 h-3" />
              <span>{template.downloads?.toLocaleString()}</span>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {template.category}
          </Badge>
        </div>

        <div className="mt-4 flex gap-2">
          <Button 
            className="flex-1 btn-hover" 
            onClick={() => handleSelectTemplate(template)}
          >
            Use Template
          </Button>
          <Button size="sm" variant="outline">
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div>
      <Navbar />
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Resume Templates</h1>
              <p className="text-slate-600 mt-1">
                Choose from {displayTemplates.length} professional templates to get started
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.value} value={category.value}>
                  {category.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <div className="aspect-[8.5/11] bg-slate-200 animate-pulse rounded-t-lg" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-9 w-full mt-4" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <Alert>
            <AlertDescription>
              Unable to load templates. Showing default templates instead.
            </AlertDescription>
          </Alert>
        )}

        {/* Templates Grid */}
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <Layout className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No templates found</h3>
              <p className="text-slate-600 mb-4">
                Try adjusting your search terms or category filter
              </p>
              <Button variant="outline" onClick={() => {
                setSearchTerm("");
                setCategoryFilter("all");
              }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="border-dashed border-2 border-slate-200">
            <CardContent className="py-12">
              <h3 className="text-xl font-semibold mb-2">Don't see what you're looking for?</h3>
              <p className="text-slate-600 mb-6">
                Start with a blank template and create your own custom design
              </p>
              <Button asChild>
                <Link to="/editor">
                  <Layout className="w-4 h-4 mr-2" />
                  Start from Scratch
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;