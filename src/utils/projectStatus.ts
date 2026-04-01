import type { ProjectStatus } from "../api/projects";
import type { BadgeTone } from "../components/ui/Badge";

export function statusToTone(status: ProjectStatus): BadgeTone {
  switch (status) {
    case "Idea":
      return "idea";
    case "Research":
      return "research";
    case "Planning":
      return "planning";
    case "Testing":
      return "testing";
    case "Implementation":
      return "implementation";
    case "Completed":
      return "completed";
  }
}
