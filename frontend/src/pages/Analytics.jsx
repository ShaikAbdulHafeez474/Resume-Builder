import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  TrendingUp, 
  Eye, 
  Download, 
  Users, 
  BarChart3,
  Activity
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import Navbar from "../components/Navbar";
import api from "../utils/api";

const Analytics = () => {
  const [dateRange, setDateRange] = useState("30d");
  const [analytics, setAnalytics] = useState({
    totalViews: 0,
    totalDownloads: 0,
    uniqueVisitors: 0,
    conversionRate: 0,
    viewsOverTime: [],
    topResumes: [],
    deviceBreakdown: [],
    locationBreakdown: []
  });

  // Fetch analytics data
  const { data, isLoading, error } = useQuery({
    queryKey: ['analytics', dateRange],
    queryFn: async () => {
      try {
        const response = await api.get(`/analytics?period=${dateRange}`);
        return response.data;
      } catch (err) {
        // Return mock data if analytics service is not fully implemented
        return null;
      }
    },
  });

  // Mock analytics data for demonstration
  useEffect(() => {
    const mockData = {
      totalViews: 1247,
      totalDownloads: 89,
      uniqueVisitors: 892,
      conversionRate: 7.1,
      viewsOverTime: [
        { date: '2024-01-01', views: 45, downloads: 3 },
        { date: '2024-01-02', views: 67, downloads: 5 },
        { date: '2024-01-03', views: 89, downloads: 7 },
        { date: '2024-01-04', views: 123, downloads: 12 },
        { date: '2024-01-05', views: 156, downloads: 15 },
        { date: '2024-01-06', views: 198, downloads: 18 },
        { date: '2024-01-07', views: 234, downloads: 21 }
      ],
      topResumes: [
        { name: 'Software Engineer Resume', views: 456, downloads: 34 },
        { name: 'Product Manager Resume', views: 234, downloads: 18 },
        { name: 'UX Designer Resume', views: 189, downloads: 12 }
      ],
      deviceBreakdown: [
        { device: 'Desktop', percentage: 65, count: 581 },
        { device: 'Mobile', percentage: 28, count: 250 },
        { device: 'Tablet', percentage: 7, count: 61 }
      ],
      locationBreakdown: [
        { country: 'United States', percentage: 42, count: 375 },
        { country: 'United Kingdom', percentage: 18, count: 161 },
        { country: 'Canada', percentage: 12, count: 107 },
        { country: 'Australia', percentage: 8, count: 71 },
        { country: 'Germany', percentage: 6, count: 54 },
        { country: 'Other', percentage: 14, count: 124 }
      ]
    };

    setAnalytics(data || mockData);
  }, [data]);

  const StatCard = ({ title, value, change, color = "blue" }) => {
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
          {change && (
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{change}% from last month
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const SimpleChart = ({ data, title }) => (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600">{item.name || item.device || item.country}</span>
                <span className="font-medium">{item.views || item.count}</span>
              </div>
              <Progress value={item.percentage || (item.views / Math.max(...data.map(d => d.views || d.count)) * 100)} />
            </div>
          ))}
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
              <h1 className="text-3xl font-bold text-slate-900">Analytics</h1>
              <p className="text-slate-600 mt-1">
                Track your resume performance and engagement
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {['7d', '30d', '90d'].map((period) => (
              <Button
                key={period}
                variant={dateRange === period ? "default" : "outline"}
                size="sm"
                onClick={() => setDateRange(period)}
              >
                {period === '7d' ? '7 days' : period === '30d' ? '30 days' : '90 days'}
              </Button>
            ))}
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Views"
            value={analytics.totalViews?.toLocaleString() || '0'}
            change={12.5}
            icon={Eye}
            color="blue"
          />
          <StatCard
            title="Downloads"
            value={analytics.totalDownloads?.toLocaleString() || '0'}
            change={8.2}
            icon={Download}
            color="green"
          />
          <StatCard
            title="Unique Visitors"
            value={analytics.uniqueVisitors?.toLocaleString() || '0'}
            change={15.3}
            icon={Users}
            color="purple"
          />
          <StatCard
            title="Conversion Rate"
            value={`${analytics.conversionRate || 0}%`}
            change={2.1}
            icon={TrendingUp}
            color="orange"
          />
        </div>

        {/* Main Analytics Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="resumes">Top Resumes</TabsTrigger>
            <TabsTrigger value="audience">Audience</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Views Over Time */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Views Over Time
                  </CardTitle>
                  <CardDescription>Daily views and downloads for the selected period</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-slate-400">
                    <div className="text-center">
                      <BarChart3 className="h-16 w-16 mx-auto mb-4" />
                      <p>Chart visualization would appear here</p>
                      <p className="text-sm mt-2">Showing {analytics.viewsOverTime?.length || 0} data points</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Device Breakdown */}
              <SimpleChart 
                data={analytics.deviceBreakdown || []}
                title="Device Breakdown"
              />
            </div>
          </TabsContent>

          <TabsContent value="resumes" className="space-y-6">
            <SimpleChart 
              data={analytics.topResumes || []}
              title="Top Performing Resumes"
            />
          </TabsContent>

          <TabsContent value="audience" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SimpleChart 
                data={analytics.locationBreakdown || []}
                title="Audience by Location"
              />
              
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Insights</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Average Session Duration</span>
                    <Badge variant="secondary">3m 42s</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Bounce Rate</span>
                    <Badge variant="secondary">24%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Return Visitors</span>
                    <Badge variant="secondary">31%</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Peak Hours</span>
                    <Badge variant="secondary">2PM - 4PM</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Loading Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Page Load Time</span>
                      <span className="font-medium">1.2s</span>
                    </div>
                    <Progress value={75} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>First Contentful Paint</span>
                      <span className="font-medium">0.8s</span>
                    </div>
                    <Progress value={80} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">User Engagement</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Time on Page</span>
                      <span className="font-medium">3m 42s</span>
                    </div>
                    <Progress value={85} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Interaction Rate</span>
                      <span className="font-medium">68%</span>
                    </div>
                    <Progress value={68} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Conversion Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>View to Download</span>
                      <span className="font-medium">7.1%</span>
                    </div>
                    <Progress value={71} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Template Usage</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <Progress value={45} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <Card className="mt-8">
          <CardContent className="flex items-center justify-between py-6">
            <div>
              <h3 className="text-lg font-semibold">Want to improve your resume performance?</h3>
              <p className="text-slate-600">
                Use our AI-powered suggestions to optimize your resume content
              </p>
            </div>
            <Button asChild>
              <Link to="/editor">
                Optimize Resume
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;