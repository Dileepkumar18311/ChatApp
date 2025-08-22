import * as React from "react";
import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { AuthModal } from "@/components/AuthModal";

const Index = () => {
  const [authModalOpen, setAuthModalOpen] = React.useState(false);
  const [authMode, setAuthMode] = React.useState<"login" | "signup">("login");

  const handleLoginClick = () => {
    setAuthMode("login");
    setAuthModalOpen(true);
  };

  const handleSignupClick = () => {
    setAuthMode("signup");
    setAuthModalOpen(true);
  };

  const handleModeSwitch = () => {
    setAuthMode(authMode === "login" ? "signup" : "login");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onLoginClick={handleLoginClick} onSignupClick={handleSignupClick} />
      <HeroSection onLoginClick={handleLoginClick} onSignupClick={handleSignupClick} />
      
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onModeSwitch={handleModeSwitch}
      />
    </div>
  );
};

export default Index;
