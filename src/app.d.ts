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

    interface WebConfigEvent {
      clientSeed: string,
      "sharedCommission:1": string,
      telegramBotAccount: string,
    }

    interface HistoryEvent {
      count: number,
      rows: UserBet[]
    }

    interface UserWallet {
      userBonus: string,
    }

    interface UserEnergy {
      currentEnergy: number
      dailyLimitTime: string,
      energyAccumulationRate: number,
      energyCapacity: number,
      lastUpdateTime: string,
      rowId: number,
    }

    interface UserBet {
      auto: number,
      coinType: number,
      multiplier: string,
      recordId: number,
      round: number,
      isWin?: number,
      amount: string,
      createdAt: string,
      updatedAt: string,
    }

    interface RoundEvent {
      status : number,
      elapsed : number,
      multiplier : number,
      pushTime : number,
      round : number,
      startTime : number,
    }

    interface VictoryEvent {
      amount: string,
      multiplier: string,
      newBalance: string,
      recordId: number,
      userId: number,
    }

    interface ResultEvent {
      count: number,
      rows: GameResult[],
    }

    interface GameResult {
      id: number,
      encryption: string,
      round: number,
      updatedAt: string,
      multiplier?: number,
    }

    interface GameEvent {
      status: string,
      multiplier: string;
      startTime: string;
      round: string,
    }

    export interface UserEscapeEvent {
      multiplier: number,
      userList: {
        amount: string,
        multiplier: string,
        nickName: string,
      }[]
    }
  }

  namespace AuthAPI {
    interface LoginResult {
      token?: string,
    }
  }
  namespace Telegram {
    interface UserData {
      id: number,
      first_name?: string,
      last_name?: string,
      username: string,
      photo_url?: string,
      auth_date: number,
      hash: string,
    }

  }

  interface Window {
    Telegram?: {
      WebApp: {
        initData: string,
        initDataUnsafe: {
          auth_date: string,
          chat_instance: string,
          chat_type: string,
          hash: string,
          user: {
            id: number,
            username: string,
            language_code: string,
            first_name?: string,
            last_name?: string,
            photo_url?: string,
          }
        }
      }
    }
  }
}


export {};
