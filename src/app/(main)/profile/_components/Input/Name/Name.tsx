"use client";

import { useRouter } from "next/navigation";
import { SettingsRowInput } from "../../General/SettingsRowInput";
import { useState, useTransition } from "react";
import { updateUserProfile } from "@/lib/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

export const Name = ({ name }: { name: string }) => {
  const router = useRouter();
  const [open, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { register, handleSubmit } = useForm({
    defaultValues: {
      name,
    },
  });
  const handleSave = async (data: { name: string }) => {
    const { name } = data;
    try {
      await updateUserProfile({
        data: {
          name,
        },
      });
      toast.success("User successfull updated");
      setIsOpen(false);
      // Invalidate + re-fetch server components
      startTransition(() => {
        router.refresh();
      });
    } catch (error) {
      toast.error("User could not be updated, something wen't wrong");
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger>
        <SettingsRowInput label="Name" value={name} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter your name</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit(handleSave)}>
          <Input {...register("name")} />
          <DialogFooter className="grid grid-cols-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
