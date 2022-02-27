<template>
  <div id="nav">
    <router-link to="/">Home</router-link> |
    <router-link to="/Dynamic">Dynamic</router-link> |
    <router-link to="/Localization">Localization</router-link> |
    <router-link to="/Numbers">Numbers</router-link> |
    <LangBtnDd id="langBtn" label="locBtnLabel" :route="$route.name" />
  </div>
  <router-view />
</template>

<script>
import LangBtnDd from "@/components/localization-dropdown.vue";

export default {
  data() {
    return {
      // end return
    };
    // end data
  },
  components: {
    LangBtnDd,
  },
  created() {},
  mounted() {},
  updated() {},
  methods: {},
  computed: {},
  watch: {},
  // end export
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}

/* The container <div> - needed to position the dropdown content */
.dropdown {
  position: relative;
  display: inline-block;
}

.dropbtn {
  background-color: #04aa6d;
  color: white;
  padding: 16px;
  font-size: 16px;
  border: none;
  min-width: 160px;
}

/* Dropdown Content (Hidden by Default) */
.dropdown-content {
  display: none;
  position: absolute;
  z-index: 1;
  background-color: #f1f1f1;
  min-width: 160px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
}

/* Links inside the dropdown */
.dropdown-content a {
  display: block;
  color: black;
  padding: 12px 16px;
  text-decoration: none;
}

.dropdown-link {
  display: block;
  color: black;
  padding: 12px 16px;
  text-decoration: none;
}

/* Show the dropdown menu on hover */
.dropdown:hover .dropdown-content {
  display: block;
  background-color: #ddd;
}

.dropdown-link:hover {
  background-color: rgb(151, 150, 150);
}

.dropdown:hover .dropbtn {
  background-color: #3e8e41;
}
</style>
