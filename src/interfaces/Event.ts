import { Bot } from '../client/Client';
export interface RunFunction {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (client: Bot, ...params: any[]): void;
}
export interface Event {
    name: string;
    run: RunFunction;
}
