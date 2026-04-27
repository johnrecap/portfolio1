/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { Dashboard } from './pages/Dashboard';
import { Pipeline } from './pages/Pipeline';
import { Candidates } from './pages/Candidates';
import { Jobs } from './pages/Jobs';
import { Settings } from './pages/Settings';
import { Interviews } from './pages/Interviews';
import { Reports } from './pages/Reports';
import { Evaluations } from './pages/Evaluations';
import { useStore } from './store/useStore';
import './i18n/config';
import { useTranslation } from 'react-i18next';

export default function App() {
  const { theme, language } = useStore();
  const { i18n } = useTranslation();

  useEffect(() => {
    // Apply theme
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    // Apply language and text direction
    i18n.changeLanguage(language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, i18n]);

  return (
    <BrowserRouter basename="/demos/hireflow-ats">
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/candidates" element={<Candidates />} />
          <Route path="/pipeline" element={<Pipeline />} />
          <Route path="/interviews" element={<Interviews />} />
          <Route path="/evaluations" element={<Evaluations />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
