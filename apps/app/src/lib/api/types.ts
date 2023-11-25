export type FetcherContext = { token?: string };

export type Endpoint<Return = unknown, Args extends unknown[] = unknown[]> = (
  ...args: Args
) => (context: FetcherContext) => Promise<Return>;
