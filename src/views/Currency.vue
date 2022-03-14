<template>
  <section>
    <div class="Currency">
      <h2>Currency</h2>
      <p>Explenation of #{myCurrency}</p>
      <img src="@/assets/images/currency/Variable.png" />
      <p id="Currency-Ex">1234567</p>
      <p>Enable function exchange</p>
      <img src="@/assets/images/currency/config.png" />
    </div>
  </section>
</template>

<script>
export default {
  name: "Currency",
  myNumber: 1234567,
  data() {
    return {};
  },
  methods: {},
  created() {},
  mounted() {},
  updated() {},
  watch: {},
};
</script>
