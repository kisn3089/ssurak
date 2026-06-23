type ActivityRenderProps<T> = {
  value: T;
  fallback?: React.ReactNode;
  children: (value: NonNullable<T>) => React.ReactNode;
};

export default function ActivityRender<T>({
  value,
  children,
  fallback,
}: ActivityRenderProps<T>) {
  if (value == null || value === false || value === "") {
    if (fallback) {
      return <>{fallback}</>;
    }
    return null;
  }

  return <>{children(value)}</>;
}
