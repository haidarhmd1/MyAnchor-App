"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SettingsRowInput } from "../../General/SettingsRowInput";

import { useRouter } from "next/navigation";
import { startTransition, useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Gender } from "@prisma/client";

import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { updateUserProfile } from "@/lib/api";
import { toast } from "sonner";

const getGenderString = ({ gender }: { gender: Gender | string }) => {
  switch (gender) {
    case Gender.FEMALE:
      return "Female";
    case Gender.MALE:
      return "Male";
    case Gender.OTHER:
      return "Other";
    default:
      return "Not set yet";
  }
};

export const GenderPicker = ({ gender }: { gender: string }) => {
  const router = useRouter();
  const [open, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    defaultValues: {
      gender,
    },
  });

  const handleSave = async (data: { gender: Gender | string }) => {
    try {
      await updateUserProfile({
        data: {
          gender: data.gender as Gender,
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
        <SettingsRowInput label="Gender" value={getGenderString({ gender })} />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select your gender</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={Gender.MALE}>Male</SelectItem>
                      <SelectItem value={Gender.FEMALE}>Female</SelectItem>
                      <SelectItem value={Gender.OTHER}>Other</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <DialogFooter className="grid grid-cols-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit">
                {isPending ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
