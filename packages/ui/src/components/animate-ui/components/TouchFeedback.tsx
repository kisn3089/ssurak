import { useState } from "react";

type TouchFeedbackRenderProps = {
  isTouched: boolean;
  touchProps: {
    onTouchStart: () => void;
    onTouchEnd: () => void;
    onTouchCancel: () => void;
  };
  mouseProps: {
    onMouseDown: () => void;
    onMouseUp: () => void;
    onMouseLeave: () => void;
  };
};

type TouchFeedbackProps = {
  children: (props: TouchFeedbackRenderProps) => React.ReactNode;
};

export default function TouchFeedback({ children }: TouchFeedbackProps) {
  const [isTouched, setIsTouched] = useState(false);

  return children({
    isTouched,
    touchProps: {
      onTouchStart: () => setIsTouched(true),
      onTouchEnd: () => setIsTouched(false),
      onTouchCancel: () => setIsTouched(false),
    },
    mouseProps: {
      onMouseDown: () => setIsTouched(true),
      onMouseUp: () => setIsTouched(false),
      onMouseLeave: () => setIsTouched(false),
    },
  });
}
