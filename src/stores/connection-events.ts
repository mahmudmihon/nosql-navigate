import { defineStore } from "pinia";
import { ConnectionInfo } from "../types/DbConnections/db-connection";

interface ConnectionEventsState {
  connectionSaved: boolean;
  connectedUrl: string;
  selectedConnection: ConnectionInfo;
}

export const useConnectionEventsStore = defineStore("connection-crud", {
  state: (): ConnectionEventsState => {
    return {
      connectionSaved: false,
      connectedUrl: '',
      selectedConnection: { id: '', name: '', url: '' },
    };
  },
  actions: {
    updateConnectionSavedEvent(value: boolean) {
      this.$state.connectionSaved = value;
    },
    updateConnectedUrl(url: string) {
      this.$state.connectedUrl = url;
    },
    updateSelectedConnection(db: ConnectionInfo) {
      this.$state.selectedConnection = db;
    }
  },
});
