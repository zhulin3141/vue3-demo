<template>
  <div
    class="chart-card"
    :class="[inCrValue > 0 ? valueUpClass : valueDownClass]"
  >
    <div>
      {{ label }}
      <i></i>
      <span>
        {{ inCrValue }}
      </span>
    </div>
    <div class="numbers">
        {{ config.number[0][0] }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    label: String,
    config: Object,
    inCrValue: Number,
  },
  setup(){
    return {
      valueUpClass: "more",
      valueDownClass: "less",
    };
  }
});
</script>