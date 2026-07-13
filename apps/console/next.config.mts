import path from "path";
import { fileURLToPath } from "url";
import type { NextConfig } from "next";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: path.join(__dirname, "../../"),
  devIndicators: false,
  reactCompiler: true,
  transpilePackages: ["@ssurak/ui", "@ssurak/api", "@ssurak/auth"],
};

export default nextConfig;
