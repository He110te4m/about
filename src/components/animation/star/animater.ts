import { Application, Sprite, Texture } from 'pixi.js'

export interface StarAnimaterOptions {
  starCount?: number
  animateTime?: number
}

interface StarInfo {
  sprite: Sprite
  x: number
  y: number
  z: number
}

const fov = 20

const starStretch = 5
const starBaseSize = 0.05

const starMinSpeed = 0.025

export class StarAnimater {
  private app!: Application
  private starTexture!: Texture
  private starInfoList: StarInfo[] = []
  private speed = 0
  private warpSpeed = 0
  private cameraZ = 0
  private animateTime: number
  private animateStartTime = 0

  constructor(parentEl: HTMLElement, { starCount = 1000, animateTime = 300 }: StarAnimaterOptions = {}) {
    this.animateTime = animateTime

    this.initApp(parentEl)
    this.initStarResource(starCount)
    this.initAnimation()
  }

  fast() {
    this.warpSpeed = 1
    this.animateStartTime = performance.now()
  }

  slow() {
    const now = performance.now()
    if (this.animateStartTime + this.animateTime < now) {
      this.warpSpeed = 0
      return
    }

    setTimeout(() => {
      this.slow()
    }, 300)
  }

  private initApp(parentEl: HTMLElement) {
    const app = new Application({ resizeTo: window })

    parentEl.appendChild(app.view as HTMLCanvasElement)

    this.app = app
  }

  private initStarResource(starCount: number) {
    this.starTexture = Texture.from('/assets/sprites/star.png')

    for (let i = 0; i < starCount; i++) {
      const star = this.createStar()
      const [x, y, z] = getRandom3DPosition(this.cameraZ, true)

      this.app.stage.addChild(star)
      this.starInfoList.push({
        sprite: star,
        x,
        y,
        z,
      })
    }
  }

  private createStar() {
    const star = new Sprite(this.starTexture)
    star.anchor.x = 0.5
    star.anchor.y = 0.7

    return star
  }

  private initAnimation() {
    this.app.ticker.add((delta) => {
      // Simple easing. This should be changed to proper easing function when used for real.
      this.speed += (this.warpSpeed - this.speed) / 20
      this.cameraZ += delta * 10 * (this.speed + starMinSpeed)

      this.starInfoList.forEach((star) => {
        if (star.z < this.cameraZ) {
          [star.x, star.y, star.z] = getRandom3DPosition(this.cameraZ)
        }

        // Map star 3d position to 2d with really simple projection
        const z = star.z - this.cameraZ

        const { width: screenWidth, height: screenHeight } = this.app.renderer.screen

        star.sprite.x = star.x * (fov / z) * screenWidth + screenWidth / 2
        star.sprite.y = star.y * (fov / z) * screenWidth + screenHeight / 2

        // Calculate star scale & rotation.
        const dxCenter = star.sprite.x - screenWidth / 2
        const dyCenter = star.sprite.y - screenHeight / 2
        const distanceCenter = Math.sqrt(dxCenter * dxCenter + dyCenter * dyCenter)
        const distanceScale = Math.max(0, (2000 - z) / 2000)

        star.sprite.scale.x = distanceScale * starBaseSize
        // Star is looking towards center so that y axis is towards center.
        // Scale the star depending on how fast we are moving, what the stretchfactor is
        // and depending on how far away it is from the center.
        star.sprite.scale.y = distanceScale * starBaseSize
          + distanceScale * this.speed * starStretch * distanceCenter / screenWidth
        star.sprite.rotation = Math.atan2(dyCenter, dxCenter) + Math.PI / 2
      })
    })
  }
}

function getRandom3DPosition(cameraZ: number, initial = false) {
  const z = initial ? Math.random() * 2000 : cameraZ + Math.random() * 1000 + 2000

  // Calculate star positions with radial random coordinate so no star hits the camera.
  const deg = Math.random() * Math.PI * 2
  const distance = Math.random() * 50 + 1

  const x = Math.cos(deg) * distance
  const y = Math.sin(deg) * distance

  return [x, y, z]
}
