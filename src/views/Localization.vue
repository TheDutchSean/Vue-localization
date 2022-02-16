<template>
  <h1 class="localization-header">.localization-header</h1>
  <section class="localization-section">
    <p class="text" id="localization-text">#localization-text</p>
    <div id="localization-examples">
      <p id="examples"><strong>#Examples</strong></p>
      <p>#localization-examples 2nd child p</p>
      <p id="localization-example-id">#localization-example-id</p>
    </div>
  </section>
    <button :id='buttonId' @mouseup="switchComp()"></button>
    <locComp1 v-if="component == false"/>
    <locComp2 v-if="component"/> 
    <p>{{label}}</p>
</template>

<script>
import locComp1 from "../components/localization-comp-1.vue";
import locComp2 from "../components/localization-comp-2.vue";
import localization from "@/scripts/localization.js";

export default {
  name: "Localization",
  data(){
    return{
      component:false,
      buttonId:"localization-btn-false",
      label:""
    // end return  
    }
  // end data  
  },
  components:{
    locComp1,
    locComp2
  },
  created(){
    this.setLabel(); 
  },
  beforeUpdate(){
    this.$store.commit("storeLocUpdate",true);
    this.setLabel(); 
  },
  updated(){},
  activated(){},
  computed:{},
  methods:{
    async switchComp(){
      if(this.component){
        this.component = false;
        this.buttonId = "localization-btn-false";
      }
      else{
        this.component = true;
        this.buttonId = "localization-btn-true";
      }
    },
    async setLabel(){
      if(!this.component){
        this.label = await localization.switchLabel("labelFalse", this.$options.name, this.$store.getters.getLang)
      }
      else{
        this.label = await localization.switchLabel("labelTrue", this.$options.name, this.$store.getters.getLang)
      }
    }
  },
  watch:{
    '$store.getters.getLang':function(){
      this.setLabel();
    }
  } 
};
</script>
