import type { AstroIntegration } from "astro";

import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
  rmSync,
} from "fs";
import { basename, join } from "path";

export type OutputSource = {
  contents: string;
  path: string;
  lang: string;
};

const CACHE_DIRECTORY = join(".cache");
const COMPONENTS_DIRECTORY = join("src", "components");

const makeCache = () => {
  rmSync(CACHE_DIRECTORY, { recursive: true });
  mkdirSync(CACHE_DIRECTORY);
};

const writeSourceComponent = (path: string): void => {
  const output: string = join(CACHE_DIRECTORY, `${basename(path)}.json`);
  const contents = readFileSync(path).toString();
  const [extension] = basename(path).split(".").slice(-1);

  const source: OutputSource = {
    contents,
    path,
    lang: extension,
  };

  writeFileSync(output, JSON.stringify(source));
};

const isFile = (path: string) => !statSync(path).isDirectory();

const captureSourceComponents = (): void => {
  const components = readdirSync(COMPONENTS_DIRECTORY);
  const paths = components
    .map((file) => join(COMPONENTS_DIRECTORY, file))
    .filter(isFile);

  paths.forEach(writeSourceComponent);
};

export default function (): AstroIntegration {
  return {
    name: "source-view",
    hooks: {
      "astro:config:setup": () => {
        makeCache();
        captureSourceComponents();
      },
    },
  };
}
