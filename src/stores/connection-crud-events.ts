import { defineStore } from "pinia";

interface ConnectionCRUDEventsState {
  connectionSaved: boolean;
}

export const useConnectionCRUDEventsStore = defineStore("connection-crud", {
  state: (): ConnectionCRUDEventsState => {
    return {
      connectionSaved: false,
    };
  },
  actions: {
    updateConnectionSavedEvent(value: boolean) {
      this.$state.connectionSaved = value;
    },
  },
});
