import { css } from "@flows/styled-system/css";
import { getAuth, signOut } from "auth/server";
import { UserCircle24 } from "icons";
import { api } from "lib/api";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { routes } from "routes";
import { Button, Icon, Popover, PopoverContent, PopoverTrigger, Text } from "ui";

type Props = {
  projectId?: string;
};

export const Header = async ({ projectId }: Props): Promise<JSX.Element> => {
  const auth = await getAuth();
  if (!auth) return redirect(routes.login());
  const fetchCtx = { token: auth.access_token };
  const [project, organizations] = await Promise.all([
    projectId ? api["/projects/:projectId"](projectId)(fetchCtx) : null,
    api["/organizations"]()(fetchCtx),
  ]);
  const orgProjects = await (() => {
    if (!project) return;
    return api["/organizations/:organizationId/projects"](project.organization_id)(fetchCtx);
  })();

  return (
    <header
      className={css({
        display: "flex",
        px: "space24",
        py: "space12",
        borderBottomWidth: "1px",
        borderStyle: "solid",
        borderColor: "border",
      })}
    >
      <div className={css({ flex: 1, display: "flex", gap: "space24", alignItems: "center" })}>
        <Link
          className={css({
            display: "inline-flex",
            alignItems: "center",
            gap: "space8",
          })}
          href={routes.home}
        >
          <Image alt="Logo" height={28} src="/logo.svg" width={28} />
          <Text variant="titleL">Flows</Text>
        </Link>

        {/* <nav>
          <ul className={css({ display: "flex" })}>
            {["projects"].map((path) => (
              <li key={path}>
                <Text
                  as="span"
                  className={css({ textTransform: "capitalize" })}
                  color="primary"
                  variant="bodyS"
                >
                  <Link className={css({ p: "space12" })} href={`/${path}`}>
                    {path}
                  </Link>
                </Text>
              </li>
            ))}
          </ul>
        </nav> */}
      </div>

      <div className={css({ display: "flex", gap: "space12", alignItems: "center" })}>
        <Popover>
          <PopoverTrigger>
            <Icon className={css({ cursor: "pointer" })} icon={UserCircle24} />
          </PopoverTrigger>
          <PopoverContent>
            <Text color="muted" variant="bodyXs">
              {auth.user.email}
            </Text>

            {project && orgProjects ? (
              <>
                <Text variant="titleM">Projects</Text>
                {orgProjects.map((proj) => {
                  const active = proj.id === projectId;
                  return (
                    <Link href={routes.project({ projectId: proj.id })} key={proj.id}>
                      <Text color={active ? "primary" : undefined} variant="bodyS">
                        {proj.name}
                      </Text>
                    </Link>
                  );
                })}
              </>
            ) : null}

            <Text variant="titleM">Organizations</Text>
            {organizations.map((org) => {
              const active = org.id === project?.organization_id;
              return (
                <Link href={routes.organization({ organizationId: org.id })} key={org.id}>
                  <Text color={active ? "primary" : undefined} variant="bodyS">
                    {org.name}
                  </Text>
                </Link>
              );
            })}
          </PopoverContent>
        </Popover>
        <form action={signOut}>
          <Button size="small" type="submit" variant="black">
            Logout
          </Button>
        </form>
      </div>
    </header>
  );
};
