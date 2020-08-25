<template>
  <div class="container">
    <h1>Simon Says</h1>
    <div class="simon">
      <ul>
        <li class="tile red" data-tile="0" @click="userClick" :class="{'hoverable': boardActive}"></li>
        <li class="tile blue" data-tile="1" @click="userClick" :class="{'hoverable': boardActive}"></li>
        <li class="tile yellow" data-tile="2" @click="userClick" :class="{'hoverable': boardActive}"></li>
        <li class="tile green" data-tile="3" @click="userClick" :class="{'hoverable': boardActive}"></li>
      </ul>
    </div>
    <div class="game-info">
      <h2>Round: {{round}}</h2>
      <button type="button" @click="startGame" :disabled="gameActive">Start</button>
      <p v-show="isLose">Sorry, you lost after {{loseRound}} rounds!</p>
    </div>
    <div class="game-options">
      <h2>Game Options:</h2>
      <input type="radio" name="mode"  value="1500" v-model.number="level">Легкий<br>
      <input type="radio" name="mode" value="1000" v-model.number="level">Средний<br>
      <input type="radio" name="mode" value="400" v-model.number="level">Сложный<br>
    </div>
  </div>
</template>

<script>
import redSound from '@/assets/sounds/1.mp3'
import blueSound from '@/assets/sounds/2.mp3'
import yellowSound from '@/assets/sounds/3.mp3'
import greenSound from '@/assets/sounds/4.mp3'
import updateGameSet from '@/helpers/updateGameSet'

export default {
  name: 'App',
  data () {
    return {
      level: 1500,
      round: 0,
      loseRound: null,
      gameActive: false,
      isLose: false,
      boardActive: false,
      gameSet: [],
      index: -1,
      sounds: []
    }
  },
  methods: {
    userClick(ev){
      if(this.boardActive){
        // Добавляем подсветку, включаем звук, выключаем подсветку
        ev.target.classList.add('active')
        this.sounds[ev.target.dataset.tile].audio.play()
        setTimeout( () => {
          ev.target.classList.remove('active')
        }, 300)
        // Увелличиваем индекс для проверки элементов массива игры
        this.index++
        // Если элемент пользователя не совпал с элементом игры (не угадали)
        if(ev.target !== this.gameSet[this.index].el){
          this.isLose = true
          this.loseRound = this.round
          this.boardActive = false
          this.index = -1
          this.gameSet = []
          this.round = 0
          this.gameActive = false
        } else {
          // Элемент совпал. Если угадали последний элемент, стартуем снова
          if(this.index + 1 === this.gameSet.length) {
            setTimeout( ()=> {
              this.boardActive = false
              this.index = -1
              this.gameSet = []
              this.startGame()
            },300)
          }
        }
      }
    },
    startGame(){
      this.isLose = false
      this.gameActive = true
      this.boardActive = false
      this.round++
      updateGameSet(this.gameSet, this.sounds, this.round);
      this.viewGameSet(0)
    },
    viewGameSet(i){
      // Проходимся по каждому элементу из набора игры рекурсией.
      if(i < this.gameSet.length){
        // Включаем звук, подсвечиваем элемент.
        setTimeout( () => {
          this.gameSet[i].audio.play()
          this.gameSet[i].el.classList.add('active')

          setTimeout( () => {
            this.gameSet[i].el.classList.remove('active')
          }, 300)
          // Вызываем себя же с новым индексом для массива.
          this.viewGameSet(i + 1)
        }, this.level)
      } else {
        // Прошлись по всем элементам массива, разрешаем кликать по цветам.
        setTimeout( () => {
          this.boardActive = true
        }, 300)
      }
    }
  },
  mounted(){
    this.sounds = [
      {
        audio: new Audio(redSound),
        el: document.querySelector('.red')
      },
      {
        audio: new Audio(blueSound),
        el: document.querySelector('.blue')
      },
      {
        audio: new Audio(yellowSound),
        el: document.querySelector('.yellow')
      },
      {
        audio: new Audio(greenSound),
        el: document.querySelector('.green')
      },
    ]
  }
}
</script>

<style lang="scss">
body {
  font-family: Arial, serif;
  color: #333;
  user-select: none;
}

h1 {
  margin: 1em 0 2em;
  text-align: center;
}

ul {
  list-style: none;
}

ul, li {
  padding: 0;
  margin: 0;
}

.clearfix {
  width: 100%;
  clear: both;
}

.container {
  width: 305px;
}

.simon {
  background: #fff;
  position: relative;
  float: left;
  margin-right: 3em;
  width: 302px;
  height: 295px;
  border-radius: 150px 150px 150px 150px;
  box-shadow: 2px 1px 12px #aaa;
}

.tile{
  height: 290px;
  border-radius: 150px 150px 150px 150px;
  position: absolute;
  text-indent: 10000px;
  opacity: 0.6;
  transition: opacity 250ms ease;
  &.active{
    opacity: 1;
  }
}

.red:hover, .blue:hover, .yellow:hover, .green:hover {
  border: 2px solid black
}

.red {
  background: #FF5643;
  clip: rect(0px, 300px, 150px, 150px);
  width: 296px;
}

.blue {
  background: dodgerblue;
  clip: rect(0px, 150px, 150px, 0px);
  width: 300px;
}

.yellow {
  background: #FEEF33;
  clip: rect(150px, 150px, 300px, 0px);
  width: 300px;
}

.green {
  background: #BEDE15;
  clip: rect(150px,300px, 300px, 150px);
  width: 296px;
}

.game-info {
  margin-top: 90px;
}

.game-info button {
  width: 5em;
  box-sizing: border-box;
  font-size: 1.4em;
  border-radius: 10px 10px 10px 10px;
  background: #6DABE8;
  border: none;
  padding: 0.3em 0.6em;
}

.game-info button:hover {
  background: #78BCFF;
}

.game-options h2 {
  margin-top: 30px;
  margin-bottom: 0;
}

.game-options input[type="radio"] {
  margin-right: 10px;
}

.hoverable:hover {
  cursor: pointer;
}
</style>
