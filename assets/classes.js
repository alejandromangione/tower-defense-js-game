/*
 * Classes
 */
class PlacementTiles {
  constructor({ position = { x: 0, y: 0 }}) {
    this.position = position
    this.size = 64
    this.color = 'rgba(255, 255, 255, 0.15)'
    this.isOccupied = false
  }

  draw() {
    c.fillStyle = this.color
    c.fillRect(this.position.x, this.position.y, this.size, this.size)
  }

  update(mouse) {
    this.draw()

    if(
      mouse.x > this.position.x && mouse.x < this.position.x + this.size &&
      mouse.y > this.position.y && mouse.y < this.position.y + this.size
    ) {
      this.color = 'rgba(255, 255, 255, 0.5)'
    } else {
      this.color = 'rgba(255, 255, 255, 0.15)'
    }
  }
}


class Enemy {
  constructor({ position = { x: 0, y: 0} }) {
    this.position = position
    this.width = 100
    this.height = 100
    this.waypointIndex = 0
    this.center = new Position(
      this.position.x + this.width / 2,
      this.position.y + this.height / 2
    )
    this.radius = 50
  }

  draw() {
    c.fillStyle = 'red'
    c.beginPath()
    c.arc(this.center.x, this.center.y, this.radius, 0, Math.PI * 2)
    c.fill()
    // c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }

  update() {
    this.draw()
    
    const waypoint = WAYPOINTS[this.waypointIndex]

    const yDistance = waypoint.y - this.center.y
    const xDistance = waypoint.x - this.center.x

    const angle = Math.atan2(yDistance, xDistance);

    this.position.x += Math.cos(angle)
    this.position.y += Math.sin(angle)
    this.center = {
      x: this.position.x + this.width / 2,
      y: this.position.y + this.height / 2
    }

    if(
      Math.round(this.center.x) === Math.round(waypoint.x) &&
      Math.round(this.center.y) === Math.round(waypoint.y) &&
      this.waypointIndex < WAYPOINTS.length -1
    ) {
      this.waypointIndex++
    }
  }
}

class Building {
  constructor({ position = { x: 0, y: 0 } }) {
    this.position = position
    this.size = 64
    this.centerPosition = new Position(
      this.position.x + this.size / 2,
      this.position.y + this.size / 2
    )
    this.projectiles = [
      new Projectile({
        position: { ...this.centerPosition },
        enemy: enemies[0]
      })
    ]
    this.radius = 250
  }

  draw() {
    c.fillStyle = 'blue'
    c.fillRect(this.position.x, this.position.y, this.size, this.size )

    c.beginPath()
    c.arc(this.centerPosition.x, this.centerPosition.y, this.radius, 0, PI_2)
    c.fillStyle = 'rgba(0 ,0, 255, 0.2)'
    c.fill()
  }
}

class Projectile {
  constructor({ position = new Position, enemy}) {
    this.position = position
    this.velocity = new Position()
    this.enemy = enemy,
    this.radius = 10
    this.power = 5
  }

  draw() {
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, PI_2)
    c.fillStyle = 'orange'
    c.fill()
  }

  update() {
    this.draw()

    const angle = Math.atan2(
      enemies[0].center.y - this.position.y,
      enemies[0].center.x - this.position.x,
    )

    this.velocity.x = Math.cos(angle) * this.power
    this.velocity.y = Math.sin(angle) * this.power 

    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
  }
}
