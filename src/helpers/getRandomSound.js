export default function (sounds) {
  // Берем рандомный звук из массива звуков
  return sounds[Math.floor(Math.random() * 4)]
}
