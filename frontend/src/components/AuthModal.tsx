import * as React from "react";
import { useUser } from "@/context/UserContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "login" | "signup";
  onModeSwitch: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  mode,
  onModeSwitch,
}) => {
  const [formData, setFormData] = React.useState({
    email: "",
    displayName: "",
    username: "",
    password: "",
  });
  const { setUser } = useUser();
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [confirmedEmail, setConfirmedEmail] = React.useState("");

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) {
      newErrors.email = "Please enter a valid work email.";
    } else if (!formData.email.includes("@")) {
      newErrors.email = "Please enter a valid work email.";
    }
    if (mode === "signup") {
      if (!formData.displayName) {
        newErrors.displayName = "Display name is required.";
      }
      if (!formData.username) {
        newErrors.username = "Username unavailable. Try using numbers, underscores etc.";
      }
    }
    if (!formData.password) {
      newErrors.password = "Please enter correct password.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      const endpoint = mode === "login" ? "/login" : "/signup";
      const payload = mode === "login"
        ? {
            ...(formData.username ? { username: formData.username } : {}),
            ...(formData.email ? { email: formData.email } : {}),
            password: formData.password
          }
        : {
            username: formData.username,
            email: formData.email,
            displayName: formData.displayName,
            password: formData.password
          };
      const res = await fetch(`http://localhost:3001${endpoint}` , {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors({ general: data.error || "Authentication failed" });
        return;
      }
      if (mode === "signup") {
        setConfirmedEmail(formData.email);
        setShowConfirmation(true);
        return;
      }
      // Store both user data and token
      const userWithToken = { ...data.user, token: data.token };
      setUser(userWithToken);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      onClose();
      window.location.href = '/app';
    } catch (err) {
      setErrors({ general: "Network error. Please try again." });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {showConfirmation ? (
        <DialogContent className="sm:max-w-md p-0 gap-0 flex flex-col items-center justify-center">
          <div className="flex flex-col items-center justify-center p-8">
            <div className="mb-4">
              <svg width="64" height="64" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="12" fill="#E5F0F7"/><path d="M7 9.5V8a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-1.5" stroke="#0A2A43" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="m7 9.5 5 3.5 5-3.5" stroke="#0A2A43" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <p className="text-center text-lg font-medium mb-6">Thanks! We have sent a confirmation email to <span className="font-bold">{confirmedEmail}</span></p>
            <Button asChild className="w-full mb-2">
              <a href="https://mail.google.com" target="_blank" rel="noopener noreferrer">Open Gmail</a>
            </Button>
            <Button variant="outline" className="w-full" onClick={() => { setShowConfirmation(false); onClose(); }}>
              Close
            </Button>
          </div>
        </DialogContent>
      ) : (
        <DialogContent className="sm:max-w-md p-0 gap-0">
          <div className="flex items-center justify-between p-6 pb-4">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-primary">
                {mode === "login" ? "Login" : "Sign Up"}
              </DialogTitle>
            </DialogHeader>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-6 w-6 rounded-full absolute right-4 top-4"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <form onSubmit={handleSubmit} className="px-6 pb-6 space-y-4">
            {errors.general && (
              <p className="text-sm text-destructive text-center">{errors.general}</p>
            )}
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email Address / Phone Number"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
            {mode === "signup" && (
              <>
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Display Name"
                    value={formData.displayName}
                    onChange={(e) => handleInputChange("displayName", e.target.value)}
                    className={errors.displayName ? "border-destructive" : ""}
                  />
                  {errors.displayName && (
                    <p className="text-sm text-destructive">{errors.displayName}</p>
                  )}
                  {formData.displayName && !errors.displayName && (
                    <p className="text-xs text-muted-foreground">
                      This is how other people see you. You can use special characters & emojis.
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Username"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    className={errors.username ? "border-destructive" : ""}
                  />
                  {errors.username && (
                    <p className="text-sm text-destructive">{errors.username}</p>
                  )}
                  {formData.username && !errors.username && (
                    <p className="text-xs text-muted-foreground">
                      Please only use numbers, letters, underscores or periods.
                    </p>
                  )}
                </div>
              </>
            )}
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={errors.password ? "border-destructive" : ""}
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
              {mode === "signup" && formData.password && !errors.password && (
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className="text-green-600">✓</span>
                  Password strength: Medium
                </p>
              )}
              {mode === "login" && (
                <div className="text-right">
                  <button
                    type="button"
                    className="text-sm text-muted-foreground hover:text-primary"
                  >
                    Forgot password
                  </button>
                </div>
              )}
            </div>
            <Button type="submit" variant="hero" className="w-full">
              {mode === "login" ? "Login" : "Sign Up"}
            </Button>
            <div className="text-center">
              <span className="text-sm text-muted-foreground">or</span>
            </div>
            <Button
              type="button"
              variant="hero-outline"
              className="w-full mt-2"
              onClick={onModeSwitch}
            >
              {mode === "login"
                ? "Create a new account"
                : "Already have an account? Login"}
            </Button>
          </form>
        </DialogContent>
      )}
    </Dialog>
  );
}

