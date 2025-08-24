import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import AppLayout from "./pages/App";
import Groups from "./pages/Groups";
import GroupChat from "./pages/GroupChat";
import DirectMessages from "./pages/DirectMessages";
import DirectMessage from "./pages/DirectMessage";
import Activity from "./pages/Activity";
import More from "./pages/More";
import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/ResetPassword";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/app" element={<AppLayout />}>
            <Route index element={<Groups />} />
            <Route path="groups" element={<Groups />} />
            <Route path="groups/:groupId" element={<GroupChat />} />
            <Route path="direct-messages" element={<DirectMessages />} />
            <Route path="dm/:userId" element={<DirectMessage />} />
            <Route path="activity" element={<Activity />} />
            <Route path="more" element={<More />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
