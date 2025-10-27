<script setup lang="ts">
  import HelloWorld from "./components/HelloWorld.vue";
  import GhostLineCanvas from "@royshell/ghostline-vue";

  function handleCtx(ctx: CanvasRenderingContext2D) {
    console.log(ctx);
  }
</script>

<template>
  <div class="wrap">
    <img
      src="/vite.svg"
      class="logo"
      alt="Vite logo" />

    <GhostLineCanvas
      :line-color="'rgba(222,9,159,0.23)'"
      :line-width="8"
      @draw-end="handleCtx($event)" />
    <a
      href="https://vite.dev"
      target="_blank">
      <img
        src="/vite.svg"
        class="logo"
        alt="Vite logo" />
    </a>
    <a
      href="https://vuejs.org/"
      target="_blank">
      <img
        src="./assets/vue.svg"
        class="logo vue"
        alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
  }
  .wrap {
    background: url(https://pub-55ace036049a4ea9a5b6c33f7c2e1974.r2.dev/public/BG%20Image3.png)
      no-repeat center center fixed;
  }
  .z {
    z-index: 9999999999999999999999;
  }
</style>
