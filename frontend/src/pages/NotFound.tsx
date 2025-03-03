
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center py-20 animate-fadeIn">
        <h1 className="text-9xl font-bold text-primary/20">404</h1>
        <div className="text-center max-w-md mx-auto space-y-4 mt-4">
          <h2 className="text-2xl font-bold">Page not found</h2>
          <p className="text-muted-foreground">
            Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </p>
          <Button onClick={() => navigate("/")} className="mt-4">
            Return Home
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
