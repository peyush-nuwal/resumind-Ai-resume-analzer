import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  { path: "/", file: "routes/home.tsx" },
  { path: "/auth", file: "routes/auth.tsx" },
  { path: "/upload", file: "routes/upload.tsx" },
] satisfies RouteConfig;
