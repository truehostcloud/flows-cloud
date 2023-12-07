"use client";

import { css } from "@flows/styled-system/css";
import { Editor } from "@monaco-editor/react";
import type { FC } from "react";
import { Spinner } from "ui";

type Props = {
  defaultValue: string;
  onChange?: (value: string) => void;
};

export const CodeEditor: FC<Props> = ({ defaultValue, onChange }) => {
  return (
    <Editor
      className={css({
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "border",
      })}
      defaultValue={defaultValue}
      height="400px"
      language="json"
      loading={
        <div
          className={css({
            borderWidth: 1,
            borderStyle: "solid",
            borderColor: "border",
            width: "100%",
            height: "100%",
            display: "grid",
            placeItems: "center",
            backgroundColor: "bg.muted",
          })}
        >
          <Spinner />
        </div>
      }
      onChange={onChange}
      options={{
        minimap: { enabled: false },
        tabSize: 2,
        readOnly: !onChange,
        scrollBeyondLastLine: false,
      }}
      theme="vs-dark"
    />
  );
};
