import type { ProjectRecord } from './content-hub';
import { DEMO_PROJECTS } from './demo-projects';

function getProjectKey(project: ProjectRecord) {
  return project.slug || project.id;
}

export function mergePublicProjects(projects: ProjectRecord[]) {
  const seen = new Set<string>();
  const mergedProjects: ProjectRecord[] = [];

  [...DEMO_PROJECTS, ...projects].forEach((project) => {
    const key = getProjectKey(project);

    if (seen.has(key)) {
      return;
    }

    seen.add(key);
    mergedProjects.push(project);
  });

  return mergedProjects;
}
