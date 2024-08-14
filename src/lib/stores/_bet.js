import { writable } from "svelte/store";

class BetStore {
  records = writable([
    { id: -1, auto: false, amount: 0 },
    { id: -1, auto: false, amount: 0 },
  ])


  updateFromInitEvent(/**@type {RugbullAPI.InitEvent}*/ event) {
    /// Load records when page reload
    this.records.update(records => {
      event.users_bet.forEach((bet, index) => {
        records[index] = {
          id: bet.recordId,
          auto: !!bet.auto,
          amount: parseFloat(bet.amount),
        };
      });
      return records
    })
  }

  reset() {
    this.records.update(records => {
      records.forEach((record) => {
        record.id = -1;
        record.auto = false;
        record.amount = 0;
      });
      return records;
    })
  }

  resetByRecordId(recordId) {
    let found = false;
    this.records.update(records => {
      records.forEach((record) => {
        if (record.id === recordId) {
          found = true
          record.id = -1;
          record.auto = false;
          record.amount = 0;
        }
      });
      return records;
    })
    return found
  }

  setRecord(index, { id, auto, amount }) {
    this.records.update(records => {
      records[index] = { id, auto, amount };
      return records;
    })
  }
}

export const betStore = new BetStore();