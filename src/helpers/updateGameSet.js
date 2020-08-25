import getRandomSound from '@/helpers/getRandomSound'

export default function updateGameSet(gameSet, sounds, round){
  // Если набор звуков игры равен соответствующему раунду, то возвращаем массив звуков.
  if (gameSet.length === round){
    return gameSet
  }
  else {
    // Массив звуков содержит меньше элементов чем в раунде. Добираем звуки в массив.
    gameSet.push(getRandomSound(sounds))
    updateGameSet(gameSet, sounds, round)
  }
}
