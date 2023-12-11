"use client";

import { css } from "@flows/styled-system/css";
import { useSend } from "hooks/use-send";
import { api } from "lib/api";
import { useRouter } from "next/navigation";
import type { FC, ReactNode } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { routes } from "routes";
import {
  Button,
  Dialog,
  DialogActions,
  DialogClose,
  DialogContent,
  DialogTitle,
  Input,
  toast,
} from "ui";

type Props = {
  trigger: ReactNode;
};

type FormData = {
  name: string;
};

export const CreateOrganizationDialog: FC<Props> = ({ trigger }) => {
  const { handleSubmit, register } = useForm<FormData>();
  const router = useRouter();
  const { send, loading } = useSend();
  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const res = await send(api["POST /organizations"](data));
    if (!res.data) return;
    router.push(routes.organization({ organizationId: res.data.id }));
  };

  return (
    <Dialog trigger={trigger}>
      <DialogTitle>Create Organization</DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Input
            {...register("name")}
            inputClassName={css({ width: "100%" })}
            label="Name"
            wrapperClassName={css({ display: "block", mt: "space4" })}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              toast("Tu ahoj!", {
                duration: 5000000,
              });
              toast.success("Tu sukces!", {
                duration: 5000000,
              });
              toast.error("Tu je error!", {
                duration: 5000000,
              });
              toast.custom(
                <div
                  className={css({
                    border: "1px solid red",
                    padding: "space8",
                    display: "flex",
                    gap: "space8",
                  })}
                >
                  Tu custom
                  <Button>Button</Button>
                </div>,
                {
                  duration: 5000000,
                },
              );

              toast.loading("Tu loading", {
                duration: 5000000,
              });
            }}
            type="button"
            variant="secondary"
          >
            Gimme Toast
          </Button>
          <DialogClose asChild>
            <Button size="small" variant="black">
              Close
            </Button>
          </DialogClose>
          <Button loading={loading} size="small" type="submit">
            Create
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
