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
        }else if (type === 'L') {
            let g = new THREE.PlaneGeometry(10, 10)
            let m = new THREE.MeshBasicMaterial({
                color: 0xff0000
            })
            let point = new THREE.Mesh(g, m)
            point.position.set(x, y, 0)
            all_mesh.push(point)
            scene.add(point)

            let l = liangP.length
            if (l === 0){
                liangP.push([x,y])
            } else if (l === 1) {
                liangP.push([x,y])
                graphics(liangP)
                liangP = []
            }
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
    function draw(pos, points) {
        let l = points.length
        let p = []
        if (l === 1){
            return points
        }
        for (let i = 1; i < l; i++) {
            p.push([
                (1 - pos)*points[i-1][0] + pos*points[i][0],
                (1 - pos)*points[i-1][1] + pos*points[i][1]
            ])
        }
        return draw(pos,p)
    }
    // scene.add(new THREE.Mesh(g, m))
}

function liang(points) {
    let x1 = points[0][0]
    let x2 = points[1][0]
    let y1 = points[0][1]
    let y2 = points[1][1]
    let left = -300
    let right = 300
    let top = 200
    let bottom = -200
    let p1 = x1 - x2
    let p2 = -p1
    let p3 = y1 - y2
    let p4 = -p3
    let q1 = x1 - left
    let q2 = right - x1
    let q3 = y1 - bottom
    let q4 = top - y1
    let u1 = q1 / p1
    let u2 = q2 / p2
    let u3 = q3 / p3
    let u4 = q4 / p4
    let u_max = Math.max.bind(null,0)
    let u_min = Math.min.bind(null,1)
    if (p1 > 0){
        u_max = u_max.bind(null, p2)
        u_min = u_min.bind(null, u2)
    } else {
        u_max = u_max.bind(null, u1)
        u_min = u_min.bind(null, u2)
    }
    if (p3 > 0){
        u_max = u_max.bind(null, u4)
        u_min = u_min.bind(null, u3)
    } else {
        u_max = u_max.bind(null, u3)
        u_min = u_min.bind(null, u4)
    }
    u_max = u_max()
    u_min = u_min()
    let x_left = x1 + u_max * p2
    let x_right = x1 + u_min * p2
    let y_left = y1 + u_max * p4
    let y_right = y1 + u_min * p4

    if (u_max > u_min) return
    let g = new THREE.Geometry()
    g.vertices.push(new THREE.Vector3(x_left, y_left, 0))
    g.vertices.push(new THREE.Vector3(x_right, y_right, 0))
    g.colors.push(new THREE.Color(0xff0000))
    g.colors.push(new THREE.Color(0xff0000))
    let m = new THREE.LineBasicMaterial({
        // linewidth: 10,
        // linecap: 'square',
        vertexColors: true
    })
    let rectangle = new THREE.Line(g, m, THREE.LinePieces)
    all_mesh.push(rectangle)
    scene.add(rectangle)
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
    } else if (type === 'L') {
        graphics = liang
    }
}

window.onload = function () {
    let B = document.getElementById('B')
    let L = document.getElementById('L')
    let clear = document.getElementById('clear')
    B.addEventListener('click', function (e) {
        e.stopPropagation()
        clearAll()
        B.classList.add('clicked')
        L.classList.remove('clicked')
        graphics = Bezier
        type = 'B'
    })
    L.addEventListener('click', function (e) {
        e.stopPropagation()
        clearAll()
        L.classList.add('clicked')
        B.classList.remove('clicked')
        graphics = liang
        type = 'L'

        let g = new THREE.Geometry()
        g.vertices.push(new THREE.Vector3(-300, -200, 0))
        g.vertices.push(new THREE.Vector3(-300, 200, 0))
        g.vertices.push(new THREE.Vector3(300, 200, 0))
        g.vertices.push(new THREE.Vector3(300, -200, 0))
        g.vertices.push(new THREE.Vector3(-300, -200, 0))
        g.colors.push(new THREE.Color(0x0000ff))
        g.colors.push(new THREE.Color(0x0000ff))
        g.colors.push(new THREE.Color(0x0000ff))
        g.colors.push(new THREE.Color(0x0000ff))
        g.colors.push(new THREE.Color(0x0000ff))
        let m = new THREE.LineBasicMaterial({
            vertexColors: true
        })
        let rectangle = new THREE.Line(g, m, THREE.LineSegments)
        all_mesh.push(rectangle)
        scene.add(rectangle)
    })
    clear.addEventListener('click', function (e) {
        e.stopPropagation()
        clearAll()
    })
}