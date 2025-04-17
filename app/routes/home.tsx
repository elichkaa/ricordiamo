import type { Route } from "./+types/home";
import { Ricordiamo } from "../ricordiamo/ricordiamo";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Ricordiamo" },
    { name: "App to help you memorize through typing", content: "Welcome to Ricordiamo!" },
  ];
}

export default function Main() {
  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <Ricordiamo />
      </div>
    </main>
  );
}
