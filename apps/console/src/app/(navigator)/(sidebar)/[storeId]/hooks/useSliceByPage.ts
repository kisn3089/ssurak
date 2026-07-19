import usePagination, { MAX_SIZE } from "./usePagination";

export default function useSliceByPage<T>(data: T[]): T[] {
  const { currentPage } = usePagination(data.length);

  const slicedData = data.slice(
    (currentPage - 1) * MAX_SIZE,
    currentPage * MAX_SIZE
  );

  return slicedData;
}
