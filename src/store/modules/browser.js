export default {
    state: {
      // browser properties
        language:"en"
    },
    mutations: {
      // set window language in state
      storeLang: function(state, mutation){
        state.language = mutation;
      }
    },
    actions: {},
    modules: {},
    getters:{
      // get the language from state
      getLang: function (state){return state.language }
    }
  
  };