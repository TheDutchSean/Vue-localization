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
.dropdown:hover .dropdown-content {
  display: block;
}
</style>

<template>
  <div :class="'dropdown '">
    <button :class="'dropbtn'" id="locBtnLabel">{{ label }}</button>
    <div :class="'dropdown-content '">
      <template v-for="(language, key) in languages" :key="key">
        <template v-if="key != selectedLang">
          <div :class="'dropdown-link '" @mouseup="storeLang(key)">
            {{ language }}
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script>
import languages from "../localization/languages.json";
import localization from "@/scripts/localization.js";

export default {
  name: "locBtnDd",
  props: {
    class: {
      container: String,
      button: String,
      content: String,
      link: String,
    },
    label: String,
    route: String,
  },
  data() {
    return {
      languages: languages,
      selectedLang: "en",
      previousLang: "",
    };
  },
  beforeMount() {},
  mounted() {},
  methods: {
    storeLang(value) {
      this.previousLang = this.selectedLang;
      this.$store.commit("storePreLang", this.selectedLang);
      this.$store.commit("storeLang", value);
      this.selectedLang = value;
      this.updateLang();
    },
    updateLang() {
      localization.locSet(
        this.route,
        this.selectedLang,
        this.previousLang,
        this.$store.getters.getExRate,
        this.route
      );
    },
    async getCurExchange() {
      const reponse = await localization.getExRate();
      this.$store.commit("storeExRate", reponse.rates);
    },
  },
  created() {
    this.getCurExchange(); // activate after testing

    // set default lang / get default from brower if not exist set englih to default
    for (let lang in this.languages) {
      if (lang.startsWith(localization.getBrowser())) {
        this.$store.commit("storeLang", lang);
        this.selectedLang = lang;
        this.previousLang = lang;
        break;
      } else {
        this.$store.commit("storeLang", "en-EU");
        this.selectedLang = "en-EU";
      }
    }

    // this.updateLang();
  },
  watch: {
    route: function () {
      this.updateLang();
    },
    "$store.getters.getLocUpdate": function () {
      if (this.$store.getters.getLocUpdate) {
        this.updateLang();
        this.$store.commit("storeLocUpdate", false);
      }
    },
  },
};
</script>
