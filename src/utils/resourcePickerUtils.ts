import { type Resource } from "@/mocks/resources";

export function scoreResource(r: Resource, requiredSkills: string[]): number {
  if (r.status === "Overallocated") return 0;
  const skillMatch = requiredSkills.length
    ? r.skills.filter((s) =>
        requiredSkills.some((req) =>
          s.toLowerCase().includes(req.toLowerCase()),
        ),
      ).length / requiredSkills.length
    : 0.5;
  const availScore =
    r.status === "Available" ? 1 : r.utilization < 80 ? 0.8 : 0.4;
  return skillMatch * 0.6 + availScore * 0.4;
}

export function getStatusStyle(status: Resource["status"]) {
  switch (status) {
    case "Available":
      return "bg-emerald-500/15 text-emerald-700 border border-emerald-500/30 dark:text-emerald-300";
    case "Allocated":
      return "bg-blue-500/15 text-blue-700 border border-blue-500/30 dark:text-blue-300";
    case "Overallocated":
      return "bg-red-500/15 text-red-700 border border-red-500/30 dark:text-red-300";
  }
}
