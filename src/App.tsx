import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout/Layout";
import { HomePage } from "./pages/HomePage/HomePage";
import { EventsPage } from "./pages/EventsPage/EventsPage";
import { EventDetailPage } from "./pages/EventDetailPage/EventDetailPage";
import { ProjectsPage } from "./pages/ProjectsPage/ProjectsPage";
import { ProjectDetailPage } from "./pages/ProjectDetailPage/ProjectDetailPage";
import { GetInvolvedPage } from "./pages/GetInvolvedPage/GetInvolvedPage";
import { FacilitiesPage } from "./pages/FacilitiesPage/FacilitiesPage";
import { FeedbackPage } from "./pages/FeedbackPage/FeedbackPage";
import { FeedbackStatusPage } from "./pages/FeedbackStatusPage/FeedbackStatusPage";
import { ContactPage } from "./pages/ContactPage/ContactPage";
import { NotFoundPage } from "./pages/NotFoundPage/NotFoundPage";

export function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:slug" element={<ProjectDetailPage />} />
        <Route path="/get-involved" element={<GetInvolvedPage />} />
        <Route path="/facilities" element={<FacilitiesPage />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/feedback/status" element={<FeedbackStatusPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

