"use client";

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
import { Button } from "@/components/ui/button";
import React, { useState, useTransition } from "react";
import { updateUserProfile } from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { DateTime } from "luxon";

export const Dob = ({ dob }: { dob: Date | null }) => {
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      dob,
    },
  });

  const [open, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSave = async (data: { dob: Date | null }) => {
    try {
      await updateUserProfile({
        data: {
          dob: data.dob!,
        },
      });
      toast.success("User date of birth successfull updated");
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
  const dt = dob ? DateTime.fromJSDate(dob) : DateTime.now();
  const dobFormatted = dt.toFormat("dd/LL/yyyy");

  return (
    <Dialog open={open} onOpenChange={(open) => setIsOpen(open)}>
      <DialogTrigger>
        <SettingsRowInput
          label="Date of birth"
          value={dob ? dobFormatted : "Not set yet"}
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chose a date of birth</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSave)}
            className="w-full space-y-8"
          >
            <FormField
              control={form.control}
              name="dob"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of birth</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value || new Date()}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        captionLayout="dropdown"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="grid grid-cols-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
