import type { PropsWithChildren } from "react";

type RoleProps = PropsWithChildren & {
  color: string;
};

const Role = ({ children, color }: RoleProps) => {
  return (
    <li class="role" style={`color: ${color}`}>
      {children}
    </li>
  );
};

const Roles = () => {
  return (
    <div class="h-screen flex items-center justify-center">
      <div class="text-4xl font-bold flex flex-row items-center gap-3">
        <span class="color-[#011c53]">i'm a</span>
        <ul class="flex flex-col items-left h-10 whitespace-nowrap overflow-hidden">
          <Role color="#666666">Software Developer</Role>
          <Role color="#4285f4">Computer Scientist</Role>
          <Role color="#ea4335">Part-time Ninja</Role>
          <Role color="#debff4">Vim Evangelist</Role>
          <Role color="#34a853">Nix Obsessive</Role>
          <Role color="#fbbc04">Full-stack Wizard</Role>
          <Role color="#c7828b">Caffeine Enthusiast</Role>
          <Role color="#84a4f9">TypeScript Gymnast</Role>
          <Role color="#fcbeb1">Slack Fiend</Role>
          <Role color="#d480aa">Rampant Automator</Role>
          <Role color="#e69cff">Prolific Emoji User</Role>
          <Role color="#afe0ce">Note Author</Role>
          <Role color="#666666">Software Developer</Role>
        </ul>
      </div>
    </div>
  );
};

export default Roles;
