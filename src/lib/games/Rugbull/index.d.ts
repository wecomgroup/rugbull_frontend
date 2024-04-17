export interface ICandle {
  time:number,
  open: number,
  close: number,
  low?: number,
  high?: number,
}

export interface RoundEvent {
  round: number;
  elapsed: number;
  status: number;
  startTime: number;
  multiplier: number;
}

export type GameState = 'connecting' | 'loading' | 'waiting' | 'running' | 'stopped'