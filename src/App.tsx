/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LandingPage } from "./pages/marketing/LandingPage";
import { AuthPage } from "./pages/auth/AuthPage";
import { OnboardingFlow } from "./pages/onboarding/OnboardingFlow";
import { DashboardLayout } from "./pages/dashboard/DashboardLayout";
import { DashboardHome } from "./pages/dashboard/DashboardHome";
import { Profile } from "./pages/dashboard/Profile";
import { NewRelease } from "./pages/dashboard/NewRelease";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/onboarding" element={<OnboardingFlow />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="profile" element={<Profile />} />
          <Route path="releases/new" element={<NewRelease />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

