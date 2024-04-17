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

export type GameState = 'connecting' | 'reconnecting' | 'loading' | 'waiting' | 'running' | 'stopped'

interface BalanceEvent1 {
  coinType: number,
  currentEnergy: number,
  dailyLimitTime: string, // ISO
  energyAccumulationRate: number,
  energyCapacity: number,
  lastUpdateTime: string,
}

interface BalanceEvent2 {
  coinType: number,
  userBonus: string,
}

interface WinEvent {
  amount : string
  multiplier : "1.20",
  newBalance : "2471.50000000",
  recordId : 124,
  userId : 1,
}

