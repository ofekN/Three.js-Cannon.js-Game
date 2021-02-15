/*

Three.js Template - Ofek Nakar

DatGui,OrbitControls


*/
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.114/build/three.module.js";
const canvasID = document.querySelector('.canvasID')
const points = document.querySelector('#points')
const camB = document.querySelector('#camButton')
let click = true
let point = 0
let health = 100;
let start = false
const healthBar = document.querySelector('#healthBar')







const scene = new THREE.Scene()
// texture loader
const texLoad = new THREE.TextureLoader()

const collideSound = new Audio('/0/mixkit-funny-squeaky-toy-hits-2813.wav')

const playSound = ()=>{

    collideSound.currentTime = 0
    collideSound.play()


}

const TexCreate = texLoad.load('/0/Crate.png');






// renderer
const renderer = new THREE.WebGLRenderer({canvas: canvasID ,antialias: true
})
renderer.setSize(window.innerWidth,window.innerHeight)
//set background color
renderer.setClearColor( '#601b16', .97 );



// screen size
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// Resize function
window.addEventListener('resize',()=>{
   sizes.width = window.innerWidth
   sizes.height = window.innerHeight

   // update the camera
   camera.aspect = sizes.width/sizes.height
   camera.updateProjectionMatrix()

   // update renderer
   renderer.setSize(window.innerWidth,window.innerHeight)
   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


})



// camera

const aspectRatio = sizes.width/sizes.height
// camera
const camera = new THREE.PerspectiveCamera(75,aspectRatio,1,100)


camera.position.z = 6
scene.add(camera)

// Cursor
// cursor client x and client y - detect cordinates of mouse

const cursor = {
  x:0,
  y:0
}
window.addEventListener('mousemove',(event)=>{

  cursor.x = event.clientX / window.innerWidth - 0.5

  // the minus is changing the direction to be logical
  cursor.y = - (event.clientY / window.innerHeight - 0.5)


})




// // Fog
// const fog = new THREE.Fog('#1d2b47',.5024,90)
// scene.fog = fog

// The house declartion



// The Lights
// Ambient light
const ambientLight = new THREE.AmbientLight('#ff5656', .919)

scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#1f9ec8', 0.7)
moonLight.position.set(3, 5,  2)


scene.add(moonLight)






const boxGeometry = new THREE.BoxGeometry(1, 1, 1)
const boxGeometry1 = new THREE.BoxGeometry(5, 5, 5)




const boxMaterial1 = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  map:TexCreate
})


//Cannon.js
const world = new CANNON.World()
world.broadphase = new CANNON.SAPBroadphase(world)
world.allowSleep = false

world.gravity.set(0,-99.82,0)

// materials
const defaultMaterial = new CANNON.Material('default')

const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
defaultMaterial,
  {
    friction:0.0051,
    restitution:0.0001

  }
  )
world.addContactMaterial(defaultContactMaterial)
world.defaultContactMaterial = defaultContactMaterial


// utils
const objToUpdatePlayers = []
const FloorToUpdate = []


// for (const object of FloorToUpdate) {

//     object.meshNewFloor.position.copy(object.bodyNewFloor.position)

// }
function init(){
  function Game(){

    const createFloors = (width, height, depth, position) =>{
     // Three.js mesh
     const mesh = new THREE.Mesh(boxGeometry1, boxMaterial1)
     mesh.scale.set(width, height, depth)
     mesh.castShadow = true
     mesh.position.copy(position)
     scene.add(mesh)

     // Cannon.js body
     const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5))

     const body = new CANNON.Body({
         mass: 100,
         position: new CANNON.Vec3(0, 1, 0),
         shape: shape,
         material: defaultMaterial
     })
     body.position.copy(position)
     world.addBody(body)

     // save in update array
     FloorToUpdate.push({
      mesh:mesh,
      body:body
     })


    }

    let levelTime = 2000

    if(start == true){
      
    setInterval(() => {
      createFloors(.5, .5, .5,{x:Math.floor(Math.random() * 8 - 1.1), y: 10, z:Math.floor(Math.random() * 8 - 1.1)})


      for (const on of FloorToUpdate) {
        if(on.body.position.y < .9999){

          scene.remove(
               on.mesh
          )

          world.removeBody(
               on.body
          )

            point += 1
            points.innerText = point

        }
        else{
          point = point
          points.innerText = point
        }

      }

      if(point >250){
        levelTime = 1000
      }
      else if(point > 500){
        levelTime = 500
      }
      else if ( point >1000){
       levelTime = 250
      }
      else if ( point > 2000){
        // you win !!
      }

    }, levelTime);
    }

    // for (let i = 0;i < BallsToCreate ;i++) {
    // }
    // for (let i = 0;i < BallsToCreate1;i++) {
    //   createRedBalls(5, 5, 5,{x:Math.floor(Math.random() * -1.5 + .51), y: 0, z:Math.floor(Math.random() * ( 300 -100) + 100)})
    //  }



     // create white ball
     const createPlayer = (width, height, depth, position) =>{
      // first three.js mesh

        // Three.js mesh
        const mesh = new THREE.Mesh(boxGeometry, boxMaterial1)
        mesh.scale.set(width, height, depth)
        mesh.castShadow = true
        mesh.position.copy(position)
        scene.add(mesh)

        // Cannon.js body
        const shape = new CANNON.Box(new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5))

        const body = new CANNON.Body({
            mass: 100,
            position: new CANNON.Vec3(0, 0, 0),
            shape: shape,
            material: defaultMaterial
        })
        body.position.copy(position)
        world.addBody(body)

     // save in update array
     objToUpdatePlayers.push({
       mesh:mesh,
       body:body
     })


    }


    createPlayer(2, 2, 2, { x: 0, y: 0, z:0 })

    }



    const mateos = new THREE.MeshStandardMaterial({map:TexCreate,color:'#ffffff'})
mateos.metalness = 0.7
mateos.roughness = 0.5
    let remove
   function createText(text){
    const fontLoad = new THREE.FontLoader()

    fontLoad.load('./Potta One_Regular.json',
          (font)=>{
            console.log('the font load')
            const textGeometry = new THREE.TextBufferGeometry(
                      text,
                      {
                        font :font,
                        size:1.5,
                        height:0.4,
                        curveSegments:10,
                        bevelEnabled:true,
                        bevelThickness:0.033,
                        bevelSize:0.02,
                        bevelOffset:0,
                        bevelSegments:3
                      }
                )

                textGeometry.center()

                const ThreeJsText = new THREE.Mesh(textGeometry,mateos)
                ThreeJsText.position.z = -10
                scene.add(ThreeJsText)

                // ThreeJsText.position.x = -2.5

          }
            )

   }
    createText('Box Game')
    Game()



    // Floor cannon
    const floorShape = new CANNON.Plane()
    const floorBody = new CANNON.Body()
    // set object to static
    floorBody.mass = 0
    floorBody.material = defaultMaterial
    floorBody.addShape(floorShape)

    floorBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(-1,0,0),
      Math.PI * .5
    )

    world.addBody(floorBody)
    // Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(15,15),
      new THREE.MeshStandardMaterial({ color: '#2e0c09'})
    )
    floor.rotation.x = - Math.PI * 0.5
    floor.position.y = -1
    scene.add(floor)

    objToUpdatePlayers[0].body.force.y =0
    // camera.lookAt(mesh.position)
    document.addEventListener('keydown', function(event) {
      /// object rotate on y-xis
        if (event.code == 'KeyW')
        {

          objToUpdatePlayers[0].body.position.z -= 0.5
          lightPlayer.position.z += 2
        }
        if (event.code == 'KeyS')
        {

          objToUpdatePlayers[0].body.position.z += 0.5
          lightPlayer.position.z -=2

        }
        if (event.code == 'KeyD')
        {
          objToUpdatePlayers[0].body.position.x += 0.5
          lightPlayer.position.x -=2

        }
        if (event.code == 'KeyA')
        {
          objToUpdatePlayers[0].body.position.x -= 0.5
          lightPlayer.position.x +=2


        }

      })



      let lightPlayer = new THREE.SpotLight();
      lightPlayer.position.set(5, 10, 5);
      lightPlayer.angle = Math.PI / 12;
      lightPlayer.penumbra = 0.5;
      lightPlayer.castShadow = true;
      lightPlayer.shadow.mapSize.width = sizes.width;
      lightPlayer.shadow.mapSize.height = sizes.height;
      lightPlayer.shadow.camera.near = 0.5;
      lightPlayer.shadow.camera.far = 10;
      scene.add(lightPlayer);




    // clock
    const clock = new THREE.Clock()

    //Orbit Controls




    /// camerea positions

    // posiiton A
    camera.position.z = 22
    camera.position.y = 16
    camera.rotation.x = -.5
    camera.rotation.y = 0
    camera.rotation.z= 0

   
    camB.addEventListener('click',()=>{
      if(click == true){
        gsap.to(camB,{duration:1,scale:1.5})
        click = false

        gsap.to(camera.position,{z:18,y:12,duration:2})
        gsap.to(camera.rotation,{z:0,y:0,x:-.5,duration:2})

      }
      else if( click == false){
        click = true
        gsap.to(camB,{duration:1,scale:1})
        gsap.to(camera.position,{z:22,y:16,duration:2})
        gsap.to(camera.rotation,{z:0,y:0,x:-.5,duration:2})
      }
    })
    // position B
    //  camera.position.z = 18
    // camera.position.y = 12
    // camera.rotation.x = -.5
    // camera.rotation.y = 0
    // camera.rotation.z= 0




    // var tl = gsap.timeline({ease:'Power1.inOut',stagger:0.001});


    // time has passed
    const elpasedTime = clock.getElapsedTime()
    let lastTime = 0
    let anima


    function anim(){
      // time of clock
        renderer.render(scene,camera)
        const elpasedTime = clock.getElapsedTime()
        const deltaTime = elpasedTime - lastTime
        lastTime = elpasedTime
    // cannon update world func
        world.step(1/60,deltaTime,3)

        // for of function

    for (const object of FloorToUpdate) {

        object.mesh.position.copy(object.body.position)

    }

    for (const object of objToUpdatePlayers) {

      object.mesh.position.copy(object.body.position)

    }

    if(objToUpdatePlayers[0].body.position.x > 10 || objToUpdatePlayers[0].body.position.x < -10){
      health -= 0.5

            healthBar.style.width = health + 'px'
    }
    if(objToUpdatePlayers[0].body.position.z > 10 || objToUpdatePlayers[0].body.position.z < -10){
      health -= 0.5

            healthBar.style.width = health + 'px'
    }


       anima =   requestAnimationFrame(anim)

    //  if(camera.position.z > 200){
    //    cancelAnimationFrame(anima)
    //  }
    // sphere body update world func


    }




    anim()



    const checkForDmg = ()=>{

      setInterval(() => {



        if(health  == 0 || health < 1){
         

          cancelAnimationFrame(anima)
        }
          objToUpdatePlayers[0].body.addEventListener('collide',(e)=>{
            playSound()
            health -= .05

            healthBar.style.width = health + 'px'

          })

      }, 50);


    }

    setTimeout(() => {
    checkForDmg()
    }, 1000);
}

gsap.fromTo(camera.position,{z:35,y:40},{z:22,y:16,duration:4})
gsap.fromTo(camera.rotation,{x:0,y:-0.5},{z:0,y:0,x:-.5,duration:2})
// start = true
init()