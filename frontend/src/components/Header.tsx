
import React from 'react';
import { Link } from 'react-router-dom';
import { LineChart, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center px-4">
        <Link to="/" className="flex items-center space-x-2">
          <LineChart className="h-6 w-6 text-primary" />
          <span className="font-medium">Stock Predictor</span>
        </Link>
        <div className="flex-1"></div>
        <nav className="flex items-center space-x-6">
          <Link 
            to="/" 
            className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <Link 
            to="#" 
            className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
          >
            About
          </Link>
          <Link 
            to="#" 
            className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
          >
            Documentation
          </Link>
          
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">{user.email}</span>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={signOut}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm" 
              asChild
              className="flex items-center gap-2"
            >
              <Link to="/auth">
                <LogIn className="h-4 w-4" />
                Login
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
