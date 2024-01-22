"use client";

import { css } from "@flows/styled-system/css";
import type { OnChange, OnMount, OnValidate } from "@monaco-editor/react";
import { Editor } from "@monaco-editor/react";
import type { FC } from "react";
import { Spinner } from "ui";

type Props = {
  defaultValue: string;
  onChange?: OnChange;
  language: "json" | "css";
  onValidate?: OnValidate;
  onMount?: OnMount;
};

export const CodeEditor: FC<Props> = (props) => {
  return (
    <Editor
      className={css({
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "border",
      })}
      height="400px"
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
      options={{
        minimap: { enabled: false },
        tabSize: 2,
        readOnly: !props.onChange,
        scrollBeyondLastLine: false,
      }}
      theme="vs-dark"
      {...props}
    />
  );
};
