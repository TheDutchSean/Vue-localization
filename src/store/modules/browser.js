export default {
    state: {
      // browser properties
      LOCALIZATION:{
        language:"en-GB",
        update:false
      }       
    },
    mutations: {
      // set window language in state
      storeLang: function(state, mutation){state.LOCALIZATION.language = mutation},
      storeLocUpdate: function(state, mutation){state.LOCALIZATION.update = mutation}
    },
    actions: {},
    modules: {},
    getters:{
      // get the language from state
      getLang: function (state){return state.LOCALIZATION.language},
      getLocUpdate: function (state){return state.LOCALIZATION.update}
    }
  };