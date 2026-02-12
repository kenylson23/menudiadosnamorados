import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import PublicMenuPage from "@/pages/PublicMenuPage";
import AdminMenuPage from "@/pages/AdminMenuPage";
import SitemapPage from "@/pages/SitemapPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={PublicMenuPage} />
      <Route path="/admin" component={AdminMenuPage} />
      <Route path="/pages" component={SitemapPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
