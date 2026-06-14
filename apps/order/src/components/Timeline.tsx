"use client";

import { useState } from "react";

type TimelineStepBase = {
  title: string;
  description?: string;
};

export type TimelineStep = TimelineStepBase &
  ({ label: string; id?: string } | { label?: never; id: string });

interface TimelineProps {
  steps: TimelineStep[];
  className?: string;
}

export default function Timeline({ steps, className = "" }: TimelineProps) {
  // TODO: activeStep 관리 로직 추가 필요 & useHook으로 분리
  const [activeStep, _setActiveStep] = useState(0);

  return (
    <ol className={`m-0 flex w-full list-none flex-col p-0 ${className}`}>
      {steps.map((step, index) => {
        const isFirst = index === 0;
        const isLast = index === steps.length - 1;
        const isActive = activeStep === index;
        const stepId = step.id ?? step.label;

        return (
          <li key={stepId} className="flex gap-3.5">
            <div className="flex w-4 flex-none flex-col items-center self-stretch">
              <span
                aria-hidden
                className={`h-3 w-0.5 ${isFirst ? "bg-transparent" : "bg-slate-200"}`}
              />
              {isActive ? (
                <span className="flex size-3.5 flex-none items-center justify-center rounded-full border-2 border-teal bg-white">
                  <span className="size-1.5 rounded-full bg-teal" />
                </span>
              ) : (
                <span className="size-3.5 flex-none rounded-full border-2 border-slate-300 bg-white" />
              )}
              <span
                aria-hidden
                className={`w-0.5 grow ${isLast ? "bg-transparent" : "bg-slate-200"}`}
              />
            </div>

            <div
              className={`${isLast ? "" : "mb-3"} flex-1 rounded-2xl border-2 border-transparent px-4 py-3 text-left text-slate-900 ${
                isActive
                  ? "shadow-sm [background:linear-gradient(var(--color-white),var(--color-white))_padding-box,linear-gradient(135deg,var(--color-teal-wash),var(--color-teal-deep))_border-box]"
                  : "bg-slate-50"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold">{step.title}</span>
                {step.label && (
                  <span className="text-xs font-bold text-teal">
                    {step.label}
                  </span>
                )}
              </div>
              {step.description && (
                <p className="mt-1 text-xs text-slate-500">
                  {step.description}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
