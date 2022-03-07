export default {
  state: {
    // browser properties
    LOCALIZATION: {
      language: "en-GB",
      preLang: "en-EU",
      currency: {},
      update: false,
    },
  },
  mutations: {
    // set window language in state
    storeLang: function (state, mutation) {
      state.LOCALIZATION.language = mutation;
    },
    storePreLang: function (state, mutation) {
      state.LOCALIZATION.preLang = mutation;
    },
    storeLocUpdate: function (state, mutation) {
      state.LOCALIZATION.update = mutation;
    },
    storeExRate: function (state, mutation) {
      state.LOCALIZATION.currency = mutation;
    },
  },
  actions: {},
  modules: {},
  getters: {
    // get the language from state
    getLang: function (state) {
      return state.LOCALIZATION.language;
    },
    getpreLang: function (state) {
      return state.LOCALIZATION.preLang;
    },
    getLocUpdate: function (state) {
      return state.LOCALIZATION.update;
    },
    getExRate: function (state) {
      return state.LOCALIZATION.currency;
    },
  },
};
