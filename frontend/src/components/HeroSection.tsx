import * as React from "react";
import { Button } from "@/components/ui/button";
import globeIllustration from "@/assets/globe-illustration.png";
import userAvatar1 from "@/assets/user-avatar-1.png";
import userAvatar2 from "@/assets/user-avatar-2.png";

interface HeroSectionProps {
  onLoginClick: () => void;
  onSignupClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onLoginClick,
  onSignupClick,
}) => {
  return (
    <section className="flex-1 flex items-center justify-center px-6 py-12">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <div className="space-y-6">
            <h1 className="text-4xl lg:text-5xl font-bold text-primary leading-tight">
              Communicate, Anywhere,{" "}
              <br />
              Anytime
            </h1>
            <p className="text-lg text-muted-foreground max-w-lg">
              Connect effortlessly across all devices with Pulse. Break free from
              limitations and redefine communication, anytime, anywhere.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="hero" onClick={onSignupClick}>
              Signup
            </Button>
            <Button variant="hero-outline" onClick={onLoginClick}>
              Login
            </Button>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="relative w-96 h-96">
            {/* Globe illustration */}
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={globeIllustration}
                alt="Global communication network"
                className="w-80 h-80 object-contain"
              />
            </div>

            {/* Location pins and avatars */}
            <div className="absolute top-8 right-8">
              <div className="relative">
                <div className="w-3 h-3 bg-primary rounded-full"></div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-primary-foreground rounded-full"></div>
                </div>
              </div>
            </div>

            <div className="absolute top-24 left-8">
              <img
                src={userAvatar1}
                alt="User avatar"
                className="w-16 h-16 object-contain"
              />
            </div>

            <div className="absolute top-4 right-24">
              <img
                src={userAvatar2}
                alt="User avatar"
                className="w-16 h-16 object-contain"
              />
            </div>

            <div className="absolute bottom-16 left-16">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
            </div>

            <div className="absolute bottom-8 right-12">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
            </div>

            <div className="absolute bottom-24 right-32">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
            </div>

            {/* Connecting lines */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 400 400"
            >
              <defs>
                <pattern
                  id="dashed-line"
                  patternUnits="userSpaceOnUse"
                  width="8"
                  height="1"
                >
                  <line
                    x1="0"
                    y1="0"
                    x2="4"
                    y2="0"
                    stroke="hsl(var(--primary))"
                    strokeWidth="1"
                  />
                </pattern>
              </defs>
              <path
                d="M 80 120 Q 200 60 320 100"
                fill="none"
                stroke="url(#dashed-line)"
                strokeWidth="1"
                opacity="0.6"
              />
              <path
                d="M 100 300 Q 200 280 300 320"
                fill="none"
                stroke="url(#dashed-line)"
                strokeWidth="1"
                opacity="0.6"
              />
            </svg>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                <path
                  d="M7 13L12 18L17 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};