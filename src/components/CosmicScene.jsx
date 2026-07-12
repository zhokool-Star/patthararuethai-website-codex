import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function CosmicScene() {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return undefined

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100)
    camera.position.set(0, 0.8, 8)

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(mount.clientWidth, mount.clientHeight)
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    mount.appendChild(renderer.domElement)

    const reduceMotion = prefersReducedMotion()
    const group = new THREE.Group()
    scene.add(group)

    const orbGeometry = new THREE.SphereGeometry(1.05, 48, 48)
    const orbMaterial = new THREE.MeshStandardMaterial({
      color: 0x8f6fff,
      emissive: 0x4f2f9a,
      emissiveIntensity: 0.75,
      metalness: 0.28,
      roughness: 0.2,
      transparent: true,
      opacity: 0.86,
    })
    const orb = new THREE.Mesh(orbGeometry, orbMaterial)
    group.add(orb)

    const glowGeometry = new THREE.SphereGeometry(1.48, 48, 48)
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: 0xf3d184,
      transparent: true,
      opacity: 0.12,
      blending: THREE.AdditiveBlending,
    })
    const glow = new THREE.Mesh(glowGeometry, glowMaterial)
    group.add(glow)

    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xd9b46b,
      transparent: true,
      opacity: 0.58,
      side: THREE.DoubleSide,
    })
    const rings = [1.78, 2.35, 2.92].map((radius, index) => {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(radius, radius + 0.015, 128),
        ringMaterial.clone(),
      )
      ring.rotation.x = Math.PI / 2.4 + index * 0.32
      ring.rotation.y = index * 0.34
      group.add(ring)
      return ring
    })

    const cardMaterial = new THREE.MeshBasicMaterial({
      color: 0xefe1ba,
      transparent: true,
      opacity: 0.72,
      side: THREE.DoubleSide,
    })
    const cards = Array.from({ length: 8 }, (_, index) => {
      const angle = (index / 8) * Math.PI * 2
      const card = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.62), cardMaterial.clone())
      card.position.set(Math.cos(angle) * 3.28, Math.sin(angle * 1.7) * 0.45, Math.sin(angle) * 3.28)
      card.rotation.set(0.3, -angle, 0.08)
      group.add(card)
      return { card, angle }
    })

    const starGeometry = new THREE.BufferGeometry()
    const starPositions = new Float32Array(700 * 3)
    for (let index = 0; index < 700; index += 1) {
      const radius = 5 + Math.random() * 9
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      starPositions[index * 3] = radius * Math.sin(phi) * Math.cos(theta)
      starPositions[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
      starPositions[index * 3 + 2] = radius * Math.cos(phi)
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
    const stars = new THREE.Points(
      starGeometry,
      new THREE.PointsMaterial({
        color: 0xf9e9bd,
        size: 0.025,
        transparent: true,
        opacity: 0.8,
      }),
    )
    scene.add(stars)

    scene.add(new THREE.AmbientLight(0xb8b0ff, 1.6))
    const keyLight = new THREE.PointLight(0xf6d37f, 18, 18)
    keyLight.position.set(2.6, 2.2, 3.4)
    scene.add(keyLight)

    const resize = () => {
      const width = mount.clientWidth || 640
      const height = mount.clientHeight || 640
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    resize()
    window.addEventListener('resize', resize)

    let frame = 0
    let animationId = 0
    const animate = () => {
      frame += 0.01
      if (!reduceMotion) {
        group.rotation.y += 0.003
        orb.rotation.y += 0.006
        glow.scale.setScalar(1 + Math.sin(frame * 2) * 0.035)
        stars.rotation.y -= 0.0008
        rings.forEach((ring, index) => {
          ring.rotation.z += 0.0025 + index * 0.0012
        })
        cards.forEach(({ card, angle }, index) => {
          const pulse = frame + index * 0.38
          card.position.y = Math.sin(pulse * 1.7 + angle) * 0.42
          card.rotation.z = Math.sin(pulse) * 0.08
        })
      }
      renderer.render(scene, camera)
      animationId = window.requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resize)
      mount.removeChild(renderer.domElement)
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose()
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose())
          } else {
            object.material.dispose()
          }
        }
      })
      renderer.dispose()
    }
  }, [])

  return <div className="cosmic-scene" ref={mountRef} aria-hidden="true" />
}
