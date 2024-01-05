import { css } from "@flows/styled-system/css";
import type { FC } from "react";
import { Spinner } from "ui";

export const PageLoading: FC = () => (
  <div
    className={css({
      display: "grid",
      placeItems: "center",
      py: "space32",
    })}
  >
    <Spinner />
  </div>
);
