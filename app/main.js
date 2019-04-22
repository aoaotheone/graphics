const THREE = require('three')
let scene, camera, render, type, graphics
let Iid = ''
let mesh = []
let all_mesh = []
let liangP = []

main()
function main() {


    scene = new THREE.Scene()

    camera = new THREE.OrthographicCamera(-window.innerWidth / 2, window.innerWidth / 2, window.innerHeight / 2, -window.innerHeight / 2, 1, 10)
    camera.updateProjectionMatrix()
    camera.position.z = 1

    render = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true
    })
    render.setSize(window.innerWidth, window.innerHeight)
    render.setPixelRatio(window.devicePixelRatio)
    render.setClearColor("#000000")
    document.body.append(render.domElement)
    document.body.addEventListener('click', function (e) {
        if (Iid !== '') {
            clearInterval(Iid)
        }
        clear()
        let x = (e.clientX * 2 - window.innerWidth) / 2
        let y = (window.innerHeight - e.clientY * 2) / 2
        if (type === 'B') {
            let g = new THREE.PlaneGeometry(10, 10)
            let m = new THREE.MeshBasicMaterial({
                color: 0xff0000
            })
            let point = new THREE.Mesh(g, m)
            point.position.set(x, y, 0)
            all_mesh.push(point)
            scene.add(point)

            graphics = graphics.bind(null, [x, y])
            graphics()
        }
    })

    renderer()
}

function Bezier() {
    let args = Array.prototype.slice.call(arguments, 0)
    let length = args.length
    let d = (length === 1) ? -1 : 20
    let k = 0
    let g = new THREE.PlaneGeometry(10, 10)
    let m = new THREE.MeshBasicMaterial({
        color: 0xffffff
    })
    Iid = setInterval(function () {
        if (k > d){
            let p = draw(1, args)
            let point = new THREE.Mesh(g, m)
            point.position.set(p[0][0], p[0][1], 0)
            mesh.push(point)
            all_mesh.push(point)
            scene.add(point)
            clearInterval(Iid)
            Iid = ''
            return
        }
        let p = draw(k / d, args)
        let point = new THREE.Mesh(g, m)
        point.position.set(p[0][0], p[0][1], 0)
        all_mesh.push(point)
        mesh.push(point)
        scene.add(point)
        k++
    },100)
    function draw(t, points) {
        let l = points.length
        let p = []
        if (l === 1){
            return points
        }
        for (let i = 1; i < l; i++) {
            p.push([
                (1 - t)*points[i-1][0] + t*points[i][0],
                (1 - t)*points[i-1][1] + t*points[i][1]
            ])
        }
        return draw(t,p)
    }
    // scene.add(new THREE.Mesh(g, m))
}
function renderer() {
    render.render(scene, camera)
    requestAnimationFrame(renderer)
}
function clear() {
    for (let i = 0; i < mesh.length; i++){
        scene.remove(mesh[i])
    }
    mesh = []
}
function clearAll() {
    for (let i = 0; i < all_mesh.length; i++){
        scene.remove(all_mesh[i])
    }
    all_mesh = []
    if (type === 'B'){
        graphics = Bezier
    }
}

window.onload = function () {
    let B = document.getElementById('B')
    let clear = document.getElementById('clear')
    B.addEventListener('click', function (e) {
        e.stopPropagation()
        clearAll()
        B.classList.add('clicked')
        graphics = Bezier
        type = 'B'
    })
    clear.addEventListener('click', function (e) {
        e.stopPropagation()
        clearAll()
    })
}
