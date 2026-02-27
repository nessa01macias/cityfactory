export type ProjectStatus =
  | "Idea"
  | "Research"
  | "Planning"
  | "Testing"
  | "Implementation"
  | "Completed";

export type Project = {
  slug: string;
  title: string;
  status: ProjectStatus;
  topics: string[];
  area: string;
  description: string;
  lastUpdated: string;
  body: string[];
  milestones: { date: string; label: string }[];
  team: string[];
};

export const PROJECTS: Project[] = [
  {
    slug: "leppavaara-station-area-development",
    title: "Leppävaara Station Area Development",
    status: "Planning",
    topics: ["Transport", "Housing"],
    area: "Leppävaara",
    description:
      "Redesigning the area around Leppävaara station to improve pedestrian access, add housing, and create new public spaces.",
    lastUpdated: "2024-03-01",
    body: [
      "Leppävaara is one of Espoo’s busiest hubs. This project explores changes around the station to make walking and cycling easier, improve public space, and support new homes near transit.",
      "City Factory is collecting resident experiences about bottlenecks, safety, and what kinds of places people want to spend time in — before plans are finalized."
    ],
    milestones: [
      { date: "2024-02-10", label: "Initial idea and site walk" },
      { date: "2024-03-01", label: "Concept planning begins" },
      { date: "2024-04-15", label: "Resident workshop (planned)" }
    ],
    team: ["Transport", "Urban Planning", "Housing"]
  },
  {
    slug: "school-route-safety-audit",
    title: "School Route Safety Audit",
    status: "Research",
    topics: ["Transport", "Safety", "Education"],
    area: "All Espoo",
    description:
      "Mapping and evaluating walking and cycling routes to schools across Espoo, identifying areas that need safety improvements.",
    lastUpdated: "2024-02-01",
    body: [
      "Safe routes matter for independence and wellbeing. This audit gathers observations from families, schools, and city teams about crossings, visibility, winter maintenance, and traffic speed near school areas.",
      "Results will guide future pilots and investments, and will be shared openly on this platform."
    ],
    milestones: [
      { date: "2024-01-20", label: "Data collection starts" },
      { date: "2024-02-01", label: "Survey analysis underway" },
      { date: "2024-03-20", label: "Findings summary (planned)" }
    ],
    team: ["Transport", "Education", "Safety"]
  },
  {
    slug: "tapiola-central-park-renewal",
    title: "Tapiola Central Park Renewal",
    status: "Testing",
    topics: ["Environment", "Culture"],
    area: "Tapiola",
    description:
      "Testing new playground equipment and gathering resident feedback on park improvements before full renovation.",
    lastUpdated: "2024-03-10",
    body: [
      "Before renovating the whole park, we’re testing a few changes on a smaller scale — and asking residents what works (and what doesn’t).",
      "This is a chance to shape the final plan: accessibility, play, lighting, seating, nature protection, and spaces for culture."
    ],
    milestones: [
      { date: "2024-02-25", label: "Pilot equipment installed" },
      { date: "2024-03-10", label: "On-site feedback sessions" },
      { date: "2024-05-01", label: "Decision on final design (planned)" }
    ],
    team: ["Parks", "Culture", "Accessibility"]
  },
  {
    slug: "senior-digital-services-pilot",
    title: "Senior Digital Services Pilot",
    status: "Implementation",
    topics: ["Health", "Education"],
    area: "Espoonlahti",
    description:
      "Providing in-person support for elderly residents to access digital city services. Pilot running at Espoonlahti library.",
    lastUpdated: "2024-01-15",
    body: [
      "Many city services are digital — but not everyone feels confident using them. This pilot offers calm, in-person help for common tasks, without judgment.",
      "We’re learning what kinds of support are most useful and how to scale it across neighborhoods."
    ],
    milestones: [
      { date: "2023-12-10", label: "Pilot planning completed" },
      { date: "2024-01-15", label: "Pilot launched" },
      { date: "2024-03-30", label: "Evaluation checkpoint (planned)" }
    ],
    team: ["Health", "Education", "Libraries"]
  },
  {
    slug: "neighborhood-climate-action-plans",
    title: "Neighborhood Climate Action Plans",
    status: "Idea",
    topics: ["Environment"],
    area: "All Espoo",
    description:
      "Exploring how each Espoo neighborhood could develop its own climate action priorities based on local conditions and resident input.",
    lastUpdated: "2024-03-05",
    body: [
      "Climate action works best when it fits local conditions. This idea explores light-weight neighborhood plans shaped by residents, schools, organizations, and city teams.",
      "The goal is practical: pick a few actions that matter locally and track progress together."
    ],
    milestones: [
      { date: "2024-03-05", label: "Idea published for feedback" },
      { date: "2024-04-01", label: "First neighborhood roundtable (planned)" }
    ],
    team: ["Environment", "Community Engagement"]
  }
];

export function getProjectBySlug(slug: string) {
  return PROJECTS.find((p) => p.slug === slug);
}

