/*
 * Init
 */
const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1280
canvas.height = 768

c.fillStyle = 'white'
c.fillRect(0, 0, canvas.width, canvas.height)

const placementTilesData2D = []

for (let i = 0; i < placementTilesData.length; i+= 20) {
  placementTilesData2D.push(placementTilesData.slice(i, i + 20))
}

const placementTiles = []

placementTilesData2D.forEach((row, y) => {
  row.forEach((symbol, x) => {
    if(symbol === 14) {
      placementTiles.push(
        new PlacementTiles({
          position: { x: x * 64, y: y * 64 }
        })
      )
    }
  })
})

const image = new Image()
image.onload = () => { animate() }
image.src = './assets/img/gameMap.png'

/*
 * Objects efinitions
 */
const enemies = []
for(let i = 1; i < 10; i++) {
  const xOffset = i * 150
  enemies.push(new Enemy({
    position: { x: WAYPOINTS[0].x - xOffset, y: WAYPOINTS[0].y }
  }))
}

const buildings = []
let activeTile = undefined;

/*
 * Animate
 */
function animate() {
  requestAnimationFrame(animate)

  c.drawImage(image, 0, 0)

  enemies.forEach((enemy) => {
    enemy.update()
  })

  placementTiles.forEach((tile) => {
    tile.update(mouse)
  })

  buildings.forEach((building) => {
    building.draw()

    for(let i = building.projectiles.length - 1; i >= 0; i--) {
      const projectile = building.projectiles[i]

      projectile.update()

      const xDiff = projectile.enemy.center.x - projectile.position.x
      const yDiff = projectile.enemy.center.x - projectile.position.x
      const distance = Math.hypot(xDiff, yDiff)

      if(distance < projectile.enemy.radius + projectile.radius) {
        building.projectiles.splice(i, 1)
      }
    }

    // building.projectiles.forEach((projectile, i) => {
      
    // })
  })
}

const mouse = { x: undefined, y: undefined }

canvas.addEventListener('click', (event) => {
  if(activeTile && !activeTile.isOccupied) {
    buildings.push(
      new Building({
        position: {
          x: activeTile.position.x,
          y: activeTile.position.y
        }
      })
    )

    activeTile.isOccupied = true;
  }
})

window.addEventListener('mousemove', (event) => {
  mouse.x = event.clientX
  mouse.y = event.clientY

  activeTile = null
  for(let i = 0; i < placementTiles.length; i++) {
    const tile = placementTiles[i]


    if(
      mouse.x > tile.position.x && mouse.x < tile.position.x + tile.size &&
      mouse.y > tile.position.y && mouse.y < tile.position.y + tile.size
    ) {
      activeTile = tile
      break
    }
  }
})