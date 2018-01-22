<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
body {
  margin: 0;
}
#app {
  font-family: Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #444;
}
button {
  font: 1rem Roboto, Helvetica, Arial, sans-serif;
  padding: 0.5rem 1rem;
  margin: .5rem .25rem;
  background: #fff;
  color: #444;
  outline: none;
  border: 1px solid #444;
  user-select: none;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
  cursor: pointer;
}
button:active {
  opacity: .75;
  transform: translateY(2px);
}

</style>
