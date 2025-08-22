import * as React from "react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLoginClick, onSignupClick }) => {
  return (
    <header className="w-full py-6 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary">Pulse</span>
          <div className="w-6 h-6">
            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
              <path
                d="M2 12L7 7L12 12L17 7L22 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              />
            </svg>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-8">
          <a href="#" className="text-foreground hover:text-primary transition-colors">
            Privacy
          </a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">
            Help Center
          </a>
          <a href="#" className="text-foreground hover:text-primary transition-colors">
            Pulse Web
          </a>
          <div className="flex items-center gap-1">
            <span className="text-foreground">Download</span>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 9L12 15L18 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </nav>

        <Button variant="hero" onClick={onSignupClick}>
          Try Pulse
        </Button>
      </div>
    </header>
  );
};