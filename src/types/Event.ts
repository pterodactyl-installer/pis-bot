import { Bot } from "../classes/Bot";

export interface RunFunction {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (bot: Bot, ...params: any[]): void;
}
export interface Event {
  name: string;
  run: RunFunction;
}
