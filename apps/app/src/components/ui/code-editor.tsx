"use client";

import { css } from "@flows/styled-system/css";
import { Editor } from "@monaco-editor/react";
import type { FC } from "react";

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
      onChange={onChange}
      options={{
        minimap: { enabled: false },
        tabSize: 2,
        readOnly: !onChange,
        scrollBeyondLastLine: false,
      }}
    />
  );
};
