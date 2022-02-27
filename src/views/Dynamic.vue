<template>
  <div class="Dynamic">
    <p></p>
    <div class="row form-group justify-content-center">
      <label
        id="dynamic-text"
        class="col-auto col-form-label text-center"
        for="in-text"
        >#dynamic-text</label
      >
      <div class="col-4">
        <input
          id="in-text"
          class="form-control text-center"
          type="text"
          v-model="text"
          @change="textChange(text)"
        />
      </div>
    </div>
    <div class="row form-group justify-content-center">
      <label
        id="number"
        class="col-auto col-form-label text-center"
        for="in-number"
        >#number</label
      >
      <div class="col-4">
        <input
          id="in-number"
          class="form-control text-center"
          type="number"
          v-model="number"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Home",
  myVariable: "I am dynamic !",
  number: 55,
  data() {
    return {
      number: "",
      text: "",
    };
  },
  methods: {
    numberChange(value) {
      this.$options.number = value;
      this.$store.commit("storeLocUpdate", true);
    },
    textChange(value) {
      this.$options.myVariable = value.toString();
      this.$store.commit("storeLocUpdate", true);
    },
  },
  created() {
    this.$store.commit("storeLocUpdate", true);
  },
  updated() {},
  watch: {
    number: async function () {
      this.numberChange(this.number);
    },
  },
};
</script>
