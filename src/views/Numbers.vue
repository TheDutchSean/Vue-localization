<template>
  <section class="numbers">
    <h2>Numbers</h2>
    <p></p>
    <p id="numbers-test">1234567</p>
    <!-- <p>{{this.$options.myNumber}}</p> -->
  </section>
</template>

<script>
export default {
  name: "Numbers",
  myNumber: 1234567,
  data() {
    return {
      myNumber: "",
    };
  },
  methods: {},
  created() {},
  mounted() {},
  updated() {},
  watch: {},
};
</script>
