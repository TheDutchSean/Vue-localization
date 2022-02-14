<style scoped>
/* The container <div> - needed to position the dropdown content */
.dropdown {
  position: relative;
  display: inline-block;
}

/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  display: none;
  position: absolute;
  z-index: 1;
}

/* Links inside the dropdown */
.dropdown-content a {
  display: block;
}

.dropdown-link {
  display: block;
}

/* Show the dropdown menu on hover */
.dropdown:hover .dropdown-content {display: block;}
</style>

<template>
    <div :class='"dropdown "'>
      <button :class='"dropbtn"' id="locBtnLabel">{{label}}</button>
      <div :class='"dropdown-content "'>
        <template v-for='(language, key) in languages' :key=key>
          <template v-if='key != selectedLang'>
            <div :class='"dropdown-link "' @mouseup="storeLang(key)">{{language}}</div>
          </template>
        </template>  
      </div>
    </div>
</template>

<script>
import {getBrowserLang} from '../scripts/localization.js';
import languages from '../localization/languages.json';
import { langSet } from "@/scripts/localization.js";

export default {
  name: "locBtnDd",
  props: {
    class:{
      container:String,
      button:String,
      content:String,
      link:String,
    },
    label:String,
    route:String,
    update:Boolean
  },
  data(){
    return{
      languages: languages,
      selectedLang:"en",  
    }
  },
  beforeMount(){}, 
  methods: {
    storeLang(value){
      this.$store.commit("storeLang",value);
      this.selectedLang = value;
      this.updateLang();
    },
    updateLang(){
      langSet("/localization/app/", this.selectedLang);
      if(this.route !== undefined){
        langSet(`/localization/${this.route}/`, this.selectedLang);
      }
    }
  },
  mounted() {
      // set default lang / get default from brower if not exist set englih to default
      for(let lang in this.languages){
        if(lang === getBrowserLang()){
          this.$store.commit("storeLang",getBrowserLang());
          this.selectedLang = getBrowserLang();
          break;
        }
        else{
          this.$store.commit("storeLang","en");
          this.selectedLang = "en";
        }
      }
      this.updateLang();
  },
  watch:{
    route: function(){
      this.updateLang();
    },
    update: function(){
      if(this.update){
        this.updateLang();
      }
    } 
  }
};
</script>
