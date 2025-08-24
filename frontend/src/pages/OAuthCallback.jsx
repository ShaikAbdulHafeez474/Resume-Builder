import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FileText, Loader2 } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { toast } from "sonner";
import useStore from "../store/useStore";

const OAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useStore();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get URL parameters
        const error = searchParams.get('error');
        const accessToken = searchParams.get('token');
        const userData = searchParams.get('user');

        if (error) {
          toast.error("Authentication failed. Please try again.");
          navigate("/login");
          return;
        }

        if (accessToken && userData) {
          const user = JSON.parse(decodeURIComponent(userData));
          setUser(user, accessToken);
          toast.success("Successfully signed in with Google!");
          navigate("/dashboard");
        } else {
          // Fallback: try to get token from backend callback
          // This would happen if the backend redirects here with tokens
          const urlParams = new URLSearchParams(window.location.search);
          const token = urlParams.get('token');
          const userParam = urlParams.get('user');
          
          if (token && userParam) {
            const user = JSON.parse(decodeURIComponent(userParam));
            setUser(user, token);
            toast.success("Successfully signed in with Google!");
            navigate("/dashboard");
          } else {
            // If no tokens in URL, redirect to login
            navigate("/login");
          }
        }
      } catch (err) {
        console.error("OAuth callback error:", err);
        toast.error("Authentication failed. Please try again.");
        navigate("/login");
      }
    };

    handleCallback();
  }, [navigate, searchParams, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center animate-pulse">
              <FileText className="w-7 h-7 text-white" />
            </div>
          </div>
          
          <div className="flex items-center gap-2 mb-4">
            <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            <h2 className="text-xl font-semibold text-slate-900">Completing sign in...</h2>
          </div>
          
          <p className="text-slate-600 text-center">
            Please wait while we finish setting up your account.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default OAuthCallback;