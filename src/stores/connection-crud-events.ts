import { defineStore } from "pinia";
import { DbConnection } from "../types/DbConnections/db-connection";

interface ConnectionCRUDEventsState {
  connectionSaved: boolean;
  selectedConnection: DbConnection;
}

export const useConnectionCRUDEventsStore = defineStore("connection-crud", {
  state: (): ConnectionCRUDEventsState => {
    return {
      connectionSaved: false,
      selectedConnection: { id: "", name: "", url: "" },
    };
  },
  actions: {
    updateConnectionSavedEvent(value: boolean) {
      this.$state.connectionSaved = value;
    },
    updateSelectedConnection(db: DbConnection) {
      this.$state.selectedConnection = db;
    }
  },
});
