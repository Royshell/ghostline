<script setup lang="ts">
  import { GhostLineCanvas } from "ghostline";

  function handleCtx(ctx) {
    console.log(ctx);
  }
</script>

<template>
  <div class="wrap">
    <video
      autoplay
      muted
      loop
      playsinline>
      <source src="https://www.pexels.com/download/video/854225/" />
    </video>
    <GhostLineCanvas
      :line-width="20"
      :line-color="'blue'"
      :fading-time="5000" />
  </div>
</template>

<style>
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
    /* //background: url(https://pub-55ace036049a4ea9a5b6c33f7c2e1974.r2.dev/public/BG%20Image3.png)
      no-repeat center center fixed; */
    width: 960px;
    height: 540px;
    position: relative;
  }
  video {
    height: 100%;
    width: 100%;
  }
  canvas {
    position: absolute;
    top: 0;
  }
  .z {
    z-index: 9999999999999999999999;
  }
</style>
