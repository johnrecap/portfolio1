import test from "node:test";
import assert from "node:assert/strict";
import {
  filterProjects,
  getFeaturedProjects,
  getLocalizedCaseStudyValue,
  normalizeProjectType,
  sortProjects,
  type ProjectRecord,
} from "./project-utils";

const sampleProjects: ProjectRecord[] = [
  {
    id: "1",
    title: "Admin Hub",
    slug: "admin-hub",
    description: "Dashboard project",
    category: "Dashboard",
    image: "https://example.com/admin.jpg",
    tags: ["React", "Firebase"],
    type: "dashboard",
    featured: true,
    featuredOrder: 2,
    createdAt: { seconds: 100 },
  },
  {
    id: "2",
    title: "Web Store",
    slug: "web-store",
    description: "Commerce web app",
    category: "Web",
    image: "https://example.com/store.jpg",
    tags: ["React", "Stripe"],
    type: "web",
    featured: true,
    featuredOrder: 1,
    createdAt: { seconds: 200 },
  },
  {
    id: "3",
    title: "API Core",
    slug: "api-core",
    description: "Backend service",
    category: "Backend",
    image: "https://example.com/api.jpg",
    tags: ["Node.js", "PostgreSQL"],
    type: "backend",
    featured: false,
    createdAt: { seconds: 300 },
  },
];

test("normalizeProjectType falls back to other for unknown values", () => {
  assert.equal(normalizeProjectType("web"), "web");
  assert.equal(normalizeProjectType("desktop"), "other");
  assert.equal(normalizeProjectType(undefined), "other");
});

test("getFeaturedProjects sorts by featuredOrder before falling back", () => {
  const result = getFeaturedProjects(sampleProjects);
  assert.deepEqual(
    result.map((project) => project.slug),
    ["web-store", "admin-hub"],
  );
});

test("getFeaturedProjects falls back to the newest projects when no featured items exist", () => {
  const result = getFeaturedProjects(
    sampleProjects.map((project) => ({ ...project, featured: false })),
    2,
  );

  assert.deepEqual(
    result.map((project) => project.slug),
    ["api-core", "web-store"],
  );
});

test("filterProjects narrows by search, type, and tag", () => {
  const result = filterProjects(sampleProjects, {
    search: "web",
    activeType: "web",
    activeTag: "React",
  });

  assert.deepEqual(result.map((project) => project.slug), ["web-store"]);
});

test("sortProjects supports featured, newest, and alphabetical order", () => {
  assert.deepEqual(
    sortProjects(sampleProjects, "featured").map((project) => project.slug),
    ["web-store", "admin-hub", "api-core"],
  );
  assert.deepEqual(
    sortProjects(sampleProjects, "newest").map((project) => project.slug),
    ["api-core", "web-store", "admin-hub"],
  );
  assert.deepEqual(
    sortProjects(sampleProjects, "alphabetical").map((project) => project.slug),
    ["admin-hub", "api-core", "web-store"],
  );
});

test("getLocalizedCaseStudyValue returns the Arabic value when requested and available", () => {
  assert.equal(
    getLocalizedCaseStudyValue("English", "Arabic", true),
    "Arabic",
  );
  assert.equal(
    getLocalizedCaseStudyValue("English", "", true),
    "English",
  );
  assert.equal(
    getLocalizedCaseStudyValue("English", "Arabic", false),
    "English",
  );
});
