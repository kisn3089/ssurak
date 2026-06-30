"use client";

import TouchFeedback from "../animate-ui/components/TouchFeedback";
import { Button } from "./button";
import { ComponentProps } from "react";

const TOUCH_EVENTS = {
  scale: "scale-95",
};

type TouchButtonProps = {
  children: React.ReactNode;
  touchEvents?: keyof typeof TOUCH_EVENTS;
} & ComponentProps<typeof Button>;

export default function TouchEventButton({
  children,
  touchEvents = "scale",
  ...props
}: TouchButtonProps) {
  const { className, ...buttonProps } = props;
  return (
    <TouchFeedback>
      {({ isTouched, touchProps, mouseProps }) => (
        <Button
          className={`${isTouched ? TOUCH_EVENTS[touchEvents] : ""} ${className}`}
          {...buttonProps}
          onClick={(event) => {
            // 중첩된 경우 inner 버튼 클릭이 outer 버튼으로 전파되지 않도록 차단
            event.stopPropagation();
            buttonProps.onClick?.(event);
          }}
          onTouchStart={(event) => {
            event.stopPropagation();
            touchProps.onTouchStart();
          }}
          onTouchEnd={(event) => {
            event.stopPropagation();
            touchProps.onTouchEnd();
          }}
          onTouchCancel={(event) => {
            event.stopPropagation();
            touchProps.onTouchCancel();
          }}
          onMouseDown={(event) => {
            event.stopPropagation();
            mouseProps.onMouseDown();
          }}
          onMouseUp={(event) => {
            event.stopPropagation();
            mouseProps.onMouseUp();
          }}
          onMouseLeave={(event) => {
            event.stopPropagation();
            mouseProps.onMouseLeave();
          }}
        >
          {children}
        </Button>
      )}
    </TouchFeedback>
  );
}
