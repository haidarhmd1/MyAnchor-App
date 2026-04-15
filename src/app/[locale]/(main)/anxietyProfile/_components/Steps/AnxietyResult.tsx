"use client";

import { type ComponentType, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Brain,
  RefreshCcw,
  Trash2Icon,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { DerivedAnxietyProfile } from "../helpers/types";
import { AnxietyResultResponse } from "@/lib/ai/anxietyProfile/types";
import { useLocale, useTranslations } from "next-intl";
import { AnxietyScreeningInput } from "../helpers/schema";
import {
  createAnxietyProfileEntry,
  deleteAnxietyProfileEntry,
} from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "@/i18n/navigation";
import { DeleteActionButton } from "@/components/DeleteActionButton/DeleteActionButton";
import { cn } from "@/lib/utils";

type Props = {
  id: string | null;
  input: AnxietyScreeningInput;
  profile: DerivedAnxietyProfile;
  anxietyResultResponse: AnxietyResultResponse;
  hasAlreadyFilledForm: boolean;
};

type ResultStep = {
  id: string;
  eyebrow: string;
  title: string;
  body: string;
  icon: ComponentType<{ className?: string }>;
};

export default function AnxietyResult({
  id,
  input,
  profile,
  anxietyResultResponse,
  hasAlreadyFilledForm,
}: Props) {
  const t = useTranslations();
  const locale = useLocale();
  const isRtl = locale.startsWith("ar");

  const router = useRouter();

  const [stepIndex, setStepIndex] = useState(0);
  const prefersReducedMotion = useReducedMotion();

  const results = useMemo<ResultStep[]>(() => {
    return [
      {
        id: "big_picture",
        eyebrow: t("anxietyScreening.anxietyResult.steps.big_picture.eyebrow"),
        title: t("anxietyScreening.anxietyResult.steps.big_picture.title"),
        body: anxietyResultResponse.big_picture,
        icon: Brain,
      },
      {
        id: "moment",
        eyebrow: t("anxietyScreening.anxietyResult.steps.moment.eyebrow"),
        title: t("anxietyScreening.anxietyResult.steps.moment.title"),
        body: anxietyResultResponse.what_happens_in_the_moment,
        icon: ArrowRight,
      },
      {
        id: "real",
        eyebrow: t("anxietyScreening.anxietyResult.steps.real.eyebrow"),
        title: t("anxietyScreening.anxietyResult.steps.real.title"),
        body: anxietyResultResponse.why_it_feels_so_real,
        icon: CheckCircle2,
      },
      {
        id: "repeat",
        eyebrow: t("anxietyScreening.anxietyResult.steps.repeat.eyebrow"),
        title: t("anxietyScreening.anxietyResult.steps.repeat.title"),
        body: anxietyResultResponse.why_it_keeps_repeating,
        icon: RefreshCcw,
      },
      {
        id: "problem",
        eyebrow: t("anxietyScreening.anxietyResult.steps.problem.eyebrow"),
        title: t("anxietyScreening.anxietyResult.steps.problem.title"),
        body: anxietyResultResponse.what_the_real_problem_is,
        icon: AlertTriangle,
      },
    ];
  }, [anxietyResultResponse]);

  const totalSlides = 1;
  const isActionSlide = stepIndex === 1;
  const progress = (stepIndex / totalSlides) * 100;

  const saveAnxietyProfile = async () => {
    try {
      await createAnxietyProfileEntry({
        locale,
        anxietyScreeningFormInputs: input,
        derivedAnxietyProfile: profile,
        anxietyProfileResult: anxietyResultResponse,
      });

      toast.success(t("form.anxietyProfile.toast.success"));
      router.refresh();
    } catch (error) {
      console.error("Failed to save anxiety profile:", error);
      toast.error(t("form.anxietyProfile.toast.error"));
    }
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4 pb-24">
      <div className="bg-background/95 rounded-3xl border p-4 shadow-sm backdrop-blur">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-muted-foreground text-xs font-medium tracking-[0.16em] uppercase">
              {t("anxietyScreening.anxietyResult.header.eyebrow")}
            </p>
            <h2 className="text-lg font-semibold">
              {t("anxietyScreening.anxietyResult.header.title")}
            </h2>
          </div>
          <Badge variant="secondary">
            {t("anxietyScreening.anxietyResult.header.badge")}
          </Badge>
        </div>
        <Progress value={progress} className="h-2" />
        <p className="text-muted-foreground mt-2 text-xs">
          {t("anxietyScreening.anxietyResult.progress.step", {
            current: stepIndex + 1,
            total: totalSlides + 1,
          })}
        </p>
        {!hasAlreadyFilledForm && !id ? (
          <div className="mt-4">
            <Button
              type="button"
              className="flex-1 rounded-2xl"
              onClick={saveAnxietyProfile}
            >
              {t("form.actions.save")}
            </Button>
          </div>
        ) : (
          <div
            className={cn("mt-4 w-full", isRtl ? "text-left" : "text-right")}
          >
            <DeleteActionButton
              triggerLabel={<Trash2Icon />}
              title={t("common.destructiveAction.title")}
              description={t("common.destructiveAction.description")}
              confirmLabel={t("common.destructiveAction.confirm")}
              cancelLabel={t("common.destructiveAction.cancel")}
              onConfirm={async () => {
                await deleteAnxietyProfileEntry(id!);
                router.replace("/home");
              }}
              loadingLabel={t("common.destructiveAction.loading")}
              errorMessage={t("common.destructiveAction.error")}
            />
          </div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {!isActionSlide ? (
          results.map((s) => (
            <motion.div
              key={s.id}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              <StoryCard
                eyebrow={s.eyebrow}
                title={s.title}
                body={s.body}
                icon={s.icon}
              />
            </motion.div>
          ))
        ) : (
          <motion.div
            key="what_changes"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? undefined : { opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            <ActionCard
              profile={profile}
              anxietyResultResponse={anxietyResultResponse}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-background/95 border-t px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <Button
            type="button"
            variant="outline"
            className="flex-1 rounded-2xl"
            onClick={() => setStepIndex((current) => Math.max(current - 1, 0))}
            disabled={stepIndex === 0}
          >
            {isRtl ? (
              <ArrowRight className="ml-2 h-4 w-4" />
            ) : (
              <ArrowLeft className="mr-2 h-4 w-4" />
            )}
            {t("common.back")}
          </Button>
          <Button
            type="button"
            className="flex-1 rounded-2xl"
            onClick={() => {
              if (isActionSlide && hasAlreadyFilledForm) {
                router.replace("/profile");
                return;
              }

              if (isActionSlide) {
                saveAnxietyProfile();
                return;
              }
              setStepIndex((current) => Math.min(current + 1, totalSlides));
            }}
          >
            {isActionSlide && hasAlreadyFilledForm && t("form.goToProfile")}
            {isActionSlide && !hasAlreadyFilledForm && t("form.actions.save")}
            {!isActionSlide && t("common.next")}
            {!isActionSlide ? (
              isRtl ? (
                <ArrowLeft className="mr-2 h-4 w-4" />
              ) : (
                <ArrowRight className="ml-2 h-4 w-4" />
              )
            ) : null}
          </Button>
        </div>
      </div>
    </div>
  );
}

function StoryCard(props: {
  eyebrow: string;
  title: string;
  body: string;
  icon: ComponentType<{ className?: string }>;
}) {
  const Icon = props.icon;

  return (
    <Card className="border-border/60 rounded-3xl shadow-sm">
      <CardHeader className="space-y-4">
        <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-2xl">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-muted-foreground text-xs font-medium tracking-[0.16em] uppercase">
            {props.eyebrow}
          </p>
          <CardTitle className="mt-2 text-2xl leading-tight">
            {props.title}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-foreground/90 text-base leading-7">{props.body}</p>
      </CardContent>
    </Card>
  );
}

function ActionCard(props: {
  profile: DerivedAnxietyProfile;
  anxietyResultResponse: AnxietyResultResponse;
}) {
  const t = useTranslations("anxietyScreening.anxietyResult");
  const focusLabel = props.profile.cbtFormulation.focus.replace(/_/g, " ");

  return (
    <Card className="border-border/60 rounded-3xl shadow-sm">
      <CardHeader>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">
            {t("actions.badges.possiblePattern", {
              pattern: focusLabel,
            })}
          </Badge>
          {props.profile.impairment.clinicallyMeaningful ? (
            <Badge variant="outline">
              {t("actions.badges.meaningfulImpact")}
            </Badge>
          ) : null}
        </div>
        <CardTitle className="text-2xl leading-tight">
          {t("actions.title")}
        </CardTitle>
        <CardDescription>{t("actions.description")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ActionTile
          title={t("actions.tiles.interpretation")}
          body={props.anxietyResultResponse.what_needs_to_change.interpretation}
        />
        <ActionTile
          title={t("actions.tiles.behavior")}
          body={props.anxietyResultResponse.what_needs_to_change.behavior}
        />
        <ActionTile
          title={t("actions.tiles.relearning")}
          body={props.anxietyResultResponse.what_needs_to_change.relearning}
        />

        <Separator />

        <div className="text-foreground/90 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm leading-6">
          {props.anxietyResultResponse.boundary_note}
        </div>
      </CardContent>
    </Card>
  );
}

function ActionTile(props: { title: string; body: string }) {
  return (
    <div className="rounded-2xl border p-4">
      <h3 className="text-muted-foreground text-sm font-semibold tracking-wide uppercase">
        {props.title}
      </h3>
      <p className="text-foreground/90 mt-2 text-sm leading-6">{props.body}</p>
    </div>
  );
}
