import { css } from "@flows/styled-system/css";
import { UserMenu } from "components/header/user-menu";
import Image from "next/image";
import Link from "next/link";
import { type FC } from "react";
import { routes } from "routes";

import { ProjectsMenu } from "./projects-menu";

export const Header: FC = () => {
  return (
    <header
      className={css({
        display: "flex",
        px: "space24",
        py: "space8",
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
          <Image alt="Logo" height={32} src="/logo.svg" width={32} />
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
        <UserMenu />
        <ProjectsMenu />
      </div>
    </header>
  );
};
