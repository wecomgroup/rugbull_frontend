// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }

  namespace RugbullAPI {
    interface InitEvent {
      userId: number,
      firstName: string
      lastName: string,
      languageCode?: string,
      users_bet: UserBet[]
      users_energy: UserEnergy,
      users_wallet: UserWallet,
    }

    interface HistoryEvent {

    }

    interface UserWallet {
      userBonus: string,
    }

    interface UserEnergy {
      currentEnergy : number
      dailyLimitTime : string,
      energyAccumulationRate : number,
      energyCapacity : number,
      lastUpdateTime : string,
      rowId : number,
    }

    interface UserBet {
      auto: number,
      betTime: string,
      coinType: number,
      multiplier: string,
      recordId: number,
      round: number,
    }
  }

  namespace Rugbull {
    interface ICandle {
      time: number,
      open: number,
      close: number,
      low?: number,
      high?: number,
    }

    interface RoundEvent {
      round: number;
      elapsed: number;
      status: number;
      startTime: number;
      multiplier: number;
    }

    type GameState = 'connecting' | 'reconnecting' | 'loading' | 'waiting' | 'running' | 'stopped'

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
      amount: string
      multiplier: "1.20",
      newBalance: "2471.50000000",
      recordId: 124,
      userId: 1,
    }
  }
}

export {};
