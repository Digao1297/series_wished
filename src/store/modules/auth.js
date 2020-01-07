import services from "@/services";
import * as storage from "@/modules/auth/storage";

export default {
  namespaced: true,

  state: {
    user: {},
    token: ""
  },

  mutations: {
    SET_USER(state, payload) {
      state.user = payload;
    },
    SET_TOKEN(state, payload) {
      state.token = payload;
    }
  },

  actions: {
    ActionSetUser({ commit }, payload) {
      commit("SET_USER", payload);
    },

    ActionSetToken({ commit }, payload) {
      storage.setHeaderToken(payload);
      storage.setLocalToken(payload);
      commit("SET_TOKEN", payload);
    },

    ActionCheckToken({ dispatch, state }) {
      if (state.token) {
        return new Promise.resolve(state.token);
      }
      const token = storage.getLocalToken();

      if (!token) {
        return new Promise.reject(new Error("token invalido"));
      }

      dispatch("ActionSetToken", token);
      return dispatch("ActionLoadSession");
    },

    ActionLoadSession({ dispatch }) {
      return new Promise(async (resolve, reject) => {
        try {
          const {
            data: { user }
          } = await services.auth.loadSession();
          dispatch("ActionSetUser", user);

          resolve();
        } catch (error) {
          dispatch("ActionSignOut");
          reject(error);
        }
      });
    },

    ActionDoLogin({ dispatch }, payload) {
      return services.auth.login(payload).then(response => {
        dispatch("ActionSetUser", response.data.user);
        dispatch("ActionSetToken", response.data.token);
      });
    },

    ActionSignOut({ dispatch }) {
      storage.setHeaderToken("");
      storage.deleteLocalToken();

      dispatch("ActionSetUser", {});
      dispatch("ActionSetUser", "");
    }
  },
  getters: {
    hasToken({ token }) {
      return !!token;
    }
  }
};
