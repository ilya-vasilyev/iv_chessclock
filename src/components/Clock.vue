<template>
  <div class="clock">
    <h1>Шахматные часы</h1>
    <button class="reset" v-if="gameState == 1" @click="resetGame()">Сброс</button>
    <div class="timers">
      <div class="timer left" :class="{active: ifOne()}">
        <b>Игрок 1</b>
        <p>{{timerToString(timers.timerOne)}}</p>
        <div class="progress">
          <div class="bar" :style="{width: timers.timerOne / defaultTime * 100 + '%'}"></div>
        </div>
      </div>
      <div class="timer right" :class="{active: !ifOne()}">
        <b>Игрок 2</b>
        <p>{{timerToString(timers.timerTwo)}}</p>
        <div class="progress">
          <div class="bar" :style="{width: timers.timerTwo / defaultTime * 100 + '%'}"></div>
        </div>
      </div>
    </div>
    <div class="controls">
      <button class="start" v-if="gameState == 0" @click="startGame">Начать игру</button>
      <button class="move" :class="{left: ifOne(), right: !ifOne()}" v-if="gameState == 1" @click="switchPlayer">Сделать ход</button>
      <p class="result" v-if="gameState == 2 && timers.timerOne < 1">У Игрока 1 закончилось время</p>
      <p class="result" v-if="gameState == 2 && timers.timerTwo < 1">У Игрока 2 закончилось время</p>
      <button class="again" v-if="gameState == 2" @click="resetGame()">Сброс</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Clock',
  data () {
    return {
      defaultTime: 120000, // 2 minutes
      gameState: 0, // 0 = initial, 1 = in progress, 2 = finished
      timers: {
        timerOne: 0,
        timerTwo: 0,
      },
      interval: null,
      lastDate: 0,

    }
  },

  computed: {

    activeTimer() {
      return this.$route.path == '/player-one' ? 'timerOne' : 'timerTwo'
    },

  },

  created() {
    // get data from params if exists, otherwise set defaults
    this.gameState = this.$route.query.gameState || 0
    this.timers.timerOne = this.$route.query.timerOne || this.defaultTime
    this.timers.timerTwo = this.$route.query.timerTwo || this.defaultTime

    if (this.gameState == 1) this.startGame()
  },

  methods: {

    setLastDate() {
      // used to calculate time since last action (start or player switching)
      this.lastDate = Date.now()
    },

    timerToString(raw) {
      // to format timers as "mm:ss:000"

      if (raw < 0) return '00:00:000'

      let minutes = parseInt((raw/(1000*60))%60)
      let seconds = parseInt((raw/1000)%60)
      let ms = parseInt(raw%1000)

      minutes = (minutes < 10) ? "0" + minutes : minutes;
      seconds = (seconds < 10) ? "0" + seconds : seconds;
      ms = (ms < 100 ? ms < 10 ? '00' : '0' : '') + ms

      return minutes + ":" + seconds + "." + ms;
    },

    ifOne() {
      return this.$route.path == '/player-one'
    },

    startGame() {
      let self = this
      this.gameState = 1
      this.$router.replace({
        query: {
          gameState: 1,
          timerOne: this.timers.timerOne,
          timerTwo: this.timers.timerTwo,
        }
      })
      this.setLastDate()
      // interval only used to refresh the data
      this.interval = setInterval(function () {

        if (self.gameState == 1 && self.timers.timerOne > 0 && self.timers.timerTwo > 0) {
          const timeDiff = Date.now() - self.lastDate;
          self.timers[self.activeTimer] -= timeDiff
          self.setLastDate()
        } else if (self.timers.timerOne <= 0 || self.timers.timerTwo <= 0) {
          self.gameState = 2
          self.interval = null
        }

      }, 16); // 16 ms = 60fps
    },

    switchPlayer() {
      this.setLastDate()
      const anotherPlayer = this.$route.path == '/player-one' ? '/player-two' : '/player-one'
      this.$router.replace({
        path: anotherPlayer,
        query: {
          gameState: 1,
          timerOne: this.timers.timerOne,
          timerTwo: this.timers.timerTwo,
        }
      })
    },

    resetGame() {
      this.gameState = 0
      this.timers.timerOne = this.defaultTime
      this.timers.timerTwo = this.defaultTime
      this.$router.replace({path: '/'})
    },

  }
}
</script>

<style scoped lang="scss">
.clock {
  width: 100%;
  margin: 4rem auto;

  .reset {
    position: fixed;
    top: 1rem;
    right: 1rem;
  }
  .timers {
    width: 100%;
    margin: 1rem auto;

    .timer {
      width: 45%;
      min-width: 150px;
      max-width: 350px;
      display: inline-block;
      margin: 0;
      padding: 3rem 0;
      opacity: .25;

      b {
        font-size: 1rem;
      }
      p {
        margin: 0;
        font-size: 2rem;
      }
      .progress {
        position: relative;
        width: 100%;
        height: 2rem;
      }
      .progress .bar {
        position: absolute;
        width: 100%;
        height: 100%;
      }

      &.left {
        color: #4997e6;
        .progress .bar {
          background: #4997e6;
          right: 0;
        }
      }
      &.right {
        color: #ff9900;
        .progress .bar {
          background: #ff9900;
          left: 0;
        }
      }

      &.left.active {
        opacity: 1;
        .progress .bar {
        }
      }
      &.right.active {
        opacity: 1;
        .progress .bar {
        }
      }
    }
  }

  .controls {
    .move {
      padding: 1.5rem;
      font-size: 1.5rem;
      border: none;
      color: #fff;
      &.left {
        text-align: left;
        background: #4997e6;
      }
      &.right {
        text-align: right;
        background: #ff9900;
      }
    }
  }
}
</style>
