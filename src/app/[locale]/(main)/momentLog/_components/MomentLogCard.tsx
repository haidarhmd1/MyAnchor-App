"use client";

import { DeleteActionButton } from "@/components/DeleteActionButton/DeleteActionButton";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { deleteMomentLogEntry } from "@/lib/api";
import { useState } from "react";

import { Sheet } from "react-modal-sheet";

import { AnimatePresence, motion } from "framer-motion";
import {
  containerVariants,
  itemVariants,
} from "@/common/const/sharedFramerMotionAnimationVars";
import { ResoningOutput } from "./types";
import { toRenderSections } from "../new/_components/Steps/FinishScreen.helper";
import {
  AnimatedPanel,
  SectionHeading,
  sectionTone,
} from "../new/_components/Steps/FinishScreen";

export const MomentLogCard = ({
  id,
  subtitle,
  reasoning,
}: {
  id: string;
  subtitle: string;
  reasoning: ResoningOutput;
}) => {
  const t = useTranslations();
  const router = useRouter();
  const [isOpen, setOpen] = useState(false);

  // tbd tackle so if i have e.g. n entries they wont get all functioned
  const sections = toRenderSections(reasoning);

  return (
    <>
      <Card
        className="border-border bg-accent/60 animate-[fadeUp_.35s_ease-out_both] space-y-0 shadow-sm transition-all active:scale-[0.98] motion-reduce:animate-none"
        onClick={() => setOpen(true)}
      >
        <div
          className="ml-auto w-fit px-4"
          onClick={(e) => e.stopPropagation()}
        >
          <DeleteActionButton
            triggerLabel={<Trash2Icon />}
            title={t("common.destructiveAction.title")}
            description={t("common.destructiveAction.description")}
            confirmLabel={t("common.destructiveAction.confirm")}
            cancelLabel={t("common.destructiveAction.cancel")}
            onConfirm={async () => {
              await deleteMomentLogEntry(id);
              router.refresh();
            }}
            loadingLabel={t("common.destructiveAction.loading")}
            errorMessage={t("common.destructiveAction.error")}
          />
        </div>
        <CardContent className="space-y-2">
          <h4 className="text-foreground text-sm font-semibold">
            {t("momentLog.entry.title")}
          </h4>

          <p className="text-muted-foreground text-xs font-medium">
            {subtitle}
          </p>
        </CardContent>
      </Card>

      <Sheet isOpen={isOpen} onClose={() => setOpen(false)}>
        <Sheet.Container className="bg-background! text-foreground!">
          <Sheet.Header className="bg-background!" />
          <Sheet.Content className="bg-background! p-4">
            <AnimatePresence mode="wait">
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-4"
              >
                {sections.map((section, index) => {
                  const key = `${section.type}-${index}`;

                  if (section.type === "title") {
                    return (
                      <motion.h3
                        key={key}
                        variants={itemVariants}
                        className="text-foreground text-xl font-semibold tracking-tight"
                      >
                        {section.content}
                      </motion.h3>
                    );
                  }

                  if (section.type === "intro") {
                    return (
                      <AnimatedPanel
                        key={key}
                        className={sectionTone(section.type)}
                      >
                        <p className="text-muted-foreground text-sm leading-6">
                          {section.content}
                        </p>
                      </AnimatedPanel>
                    );
                  }

                  if (section.type === "text") {
                    return (
                      <AnimatedPanel
                        key={key}
                        className={sectionTone(section.type)}
                      >
                        <div className="space-y-2">
                          <SectionHeading>
                            {t(`aiResponseMomentLog.${section.id}`)}
                          </SectionHeading>
                          <p className="text-muted-foreground text-sm leading-6">
                            {section.content}
                          </p>
                        </div>
                      </AnimatedPanel>
                    );
                  }

                  if (
                    section.type === "steps" ||
                    section.type === "red_flags"
                  ) {
                    return (
                      <AnimatedPanel
                        key={key}
                        className={sectionTone(section.type)}
                      >
                        <div className="space-y-3">
                          <SectionHeading>
                            {t(`aiResponseMomentLog.${section.id}`)}
                          </SectionHeading>

                          <motion.ul
                            className="space-y-2"
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                          >
                            {section.items.map((item, i) => (
                              <motion.li
                                key={i}
                                variants={itemVariants}
                                className="bg-card/70 text-muted-foreground rounded-2xl px-3 py-2 text-sm leading-6"
                              >
                                {item}
                              </motion.li>
                            ))}
                          </motion.ul>
                        </div>
                      </AnimatedPanel>
                    );
                  }

                  if (section.type === "symptoms") {
                    return (
                      <motion.section
                        key={key}
                        variants={itemVariants}
                        layout
                        className="space-y-3"
                      >
                        <SectionHeading>
                          {t(`aiResponseMomentLog.${section.id}`)}
                        </SectionHeading>

                        <motion.div
                          className="space-y-3"
                          variants={containerVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          {section.items.map((item, i) => (
                            <motion.div
                              key={i}
                              variants={itemVariants}
                              className="border-border bg-card rounded-3xl border p-4 shadow-sm"
                            >
                              <div className="text-foreground text-sm font-semibold">
                                {t(`taxonomy.SYMPTOM.${item.symptom}.label`)}
                              </div>
                              <div className="text-muted-foreground mt-1 text-sm leading-6">
                                {item.explanation}
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      </motion.section>
                    );
                  }

                  if (section.type === "affirmation") {
                    return (
                      <AnimatedPanel
                        key={key}
                        className={sectionTone(section.type)}
                      >
                        <div className="space-y-1">
                          <div className="text-foreground text-sm font-semibold">
                            {t(`aiResponseMomentLog.${section.id}`)}
                          </div>
                          <p className="text-muted-foreground text-sm leading-6">
                            {section.content}
                          </p>
                        </div>
                      </AnimatedPanel>
                    );
                  }

                  return null;
                })}
              </motion.div>
            </AnimatePresence>
          </Sheet.Content>
        </Sheet.Container>

        <Sheet.Backdrop className="bg-foreground/20! backdrop-blur-sm!" />
      </Sheet>
    </>
  );
};
