"use client";

import TouchFeedback from "../animate-ui/components/TouchFeedback";
import { Button } from "./button";
import { ComponentProps, forwardRef } from "react";

const TOUCH_EVENTS = {
  scale: "scale-95",
};

type TouchButtonProps = {
  children: React.ReactNode;
  touchEvents?: keyof typeof TOUCH_EVENTS;
  swallowEvent?: boolean;
} & ComponentProps<typeof Button>;

const TouchEventButton = forwardRef<HTMLButtonElement, TouchButtonProps>(
  function TouchEventButton(
    { children, touchEvents = "scale", swallowEvent = true, ...props },
    ref
  ) {
    const { className, ...buttonProps } = props;
    const stopIfSwallow = (event: { stopPropagation: () => void }) => {
      if (swallowEvent) event.stopPropagation();
    };
    return (
      <TouchFeedback>
        {({ isTouched, touchProps, mouseProps }) => (
          <Button
            ref={ref}
            className={`${isTouched ? TOUCH_EVENTS[touchEvents] : ""} ${className}`}
            {...buttonProps}
            onClick={(event) => {
              // 중첩된 경우 inner 버튼 클릭이 outer 버튼으로 전파되지 않도록 차단
              stopIfSwallow(event);
              buttonProps.onClick?.(event);
            }}
            onTouchStart={(event) => {
              stopIfSwallow(event);
              touchProps.onTouchStart();
            }}
            onTouchEnd={(event) => {
              stopIfSwallow(event);
              touchProps.onTouchEnd();
            }}
            onTouchCancel={(event) => {
              stopIfSwallow(event);
              touchProps.onTouchCancel();
            }}
            onMouseDown={(event) => {
              stopIfSwallow(event);
              mouseProps.onMouseDown();
            }}
            onMouseUp={(event) => {
              stopIfSwallow(event);
              mouseProps.onMouseUp();
            }}
            onMouseLeave={(event) => {
              stopIfSwallow(event);
              mouseProps.onMouseLeave();
            }}
          >
            {children}
          </Button>
        )}
      </TouchFeedback>
    );
  }
);
TouchEventButton.displayName = "TouchEventButton";

export default TouchEventButton;
