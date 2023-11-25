import { permanentRedirect } from "next/navigation";
import { routes } from "routes";

export default function HomePage(): JSX.Element {
  return permanentRedirect(routes.dashboard);
}
