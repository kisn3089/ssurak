type OptionGroup = Record<string, string> | undefined;
type FingerprintArgs = [id: string, ...optionGroups: OptionGroup[]];

/**
 * 옵션 그룹을 키 기준으로 정렬한 [key, value] 튜플 배열로 정규화한다.
 * 구분자 문자열로 합치지 않고 구조(배열)를 그대로 유지하므로,
 * 키/값에 `=`, `&`, `|` 같은 문자가 포함돼도 충돌하지 않는다.
 */
const canonical = (obj?: Record<string, string>): [string, string][] =>
  obj
    ? Object.keys(obj)
        .sort()
        .map((k) => [k, obj[k]])
    : [];

/**
 * 인자 배열의 첫 번째 요소로 식별자(id)를 넣고,
 * 그 뒤에 옵션 그룹들을 순서대로 전달한다.
 *
 * 정규화한 구조를 JSON.stringify로 직렬화해 구분자 주입(injection)으로 인한
 * 서로 다른 옵션 조합의 fingerprint 충돌을 방지한다.
 *
 * @param args - `[id, ...optionGroups]` 형태의 튜플. 첫 번째 요소는 id 문자열.
 * @example
 * generateFingerprint([menu.menuPublicId, menu.requiredOptions, menu.customOptions]);
 */
export function generateFingerprint<T extends FingerprintArgs>([
  id,
  ...optionGroups
]: T) {
  return JSON.stringify([id, ...optionGroups.map(canonical)]);
}
