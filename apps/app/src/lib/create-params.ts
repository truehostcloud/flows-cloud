type Params = Record<string, string | string[] | boolean | number | undefined>;

export function createParams(params?: Params): string {
  const filteredParams = Object.entries(params ?? {}).reduce<Params>((acc, [key, value]) => {
    if (value) acc[key] = value;
    return acc;
  }, {});
  const paramsString = new URLSearchParams(filteredParams as Record<string, string>).toString();
  if (!paramsString) return "";
  return `?${paramsString}`;
}
