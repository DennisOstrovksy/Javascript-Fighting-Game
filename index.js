const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const gravity = 0.7
canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const background = new Character({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: "./img/background.png"
})

const shop = new Character({
    position: {
        x: 600,
        y: 128
    },
    imageSrc: "./img/shop.png",
    scale: 2.75,
    framesMax: 6
})

const player1 = new Fighter({
    position: {
    x: 30,
    y: 0
}, 
velocity: {
    x: 0,
    y: 10
},
offset: {
    x: 0,
    y: 0
},
imageSrc: './img/samuraiMack/Idle.png',
framesMax: 8,
scale:2.5,
offset: {
    x: 215,
    y: 157
},
sprites: {
    idle: {
        imageSrc: './img/samuraiMack/Idle.png',
        framesMax: 8
    },
    run: {
        imageSrc: './img/samuraiMack/Run.png',
        framesMax: 8
    },
    jump: {
        imageSrc: './img/samuraiMack/Jump.png',
        framesMax: 2
    },
    fall: {
        imageSrc: './img/samuraiMack/Fall.png',
        framesMax: 2
    },
    attack1: {
        imageSrc: './img/samuraiMack/Attack1.png',
        framesMax: 6
    },
    takeHit: {
        imageSrc: './img/samuraiMack/Take Hit - white silhouette.png',
        framesMax: 4
    },
    death: {
        imageSrc: './img/samuraiMack/Death.png',
        framesMax: 6
    }

},
attackBox: {
    offset: {
        x: 100,
        y: 50
    },
    width: 160,
    height: 50
}

}) 

const player2 = new Fighter({
    position: {
    x: 935,
    y: 100
}, 
velocity: {
    x: 0,
    y: 0
},
offset: {
    x: -50,
    y: 0
},
color: 'blue',
imageSrc: './img/kenji/Idle.png',
framesMax: 4,
scale:2.5,
offset: {
    x: 215,
    y: 167
},
sprites: {
    idle: {
        imageSrc: './img/kenji/Idle.png',
        framesMax: 4
    },
    run: {
        imageSrc: './img/kenji/Run.png',
        framesMax: 8
    },
    jump: {
        imageSrc: './img/kenji/Jump.png',
        framesMax: 2
    },
    fall: {
        imageSrc: './img/kenji/Fall.png',
        framesMax: 2
    },
    attack1: {
        imageSrc: './img/kenji/Attack1.png',
        framesMax: 4
    },
    takeHit: {
        imageSrc: './img/kenji/Take hit.png',
        framesMax: 3
    }, 
    death: {
        imageSrc: './img/kenji/Death.png',
        framesMax: 7
    }

},
attackBox: {
    offset: {
        x: -170,
        y: 50
    },
    width: 170,
    height: 50
}
}) 


console.log(player1)

const keys = {
    a: {
        pressed:  false
    },
    d: {
        pressed:  false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}



decreaseTimer()

function animation() {
    window.requestAnimationFrame(animation)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.update()
    shop.update()
    c.fillStyle = 'rgba(255, 255, 255, 0.2)'
    c.fillRect(0, 0, canvas.width, canvas.height)
    player1.update()
    player2.update()

    player1.velocity.x = 0
    player2.velocity.x = 0

// player1 movement
    if (keys.a.pressed && player1.lastKey === 'a') {
        player1.velocity.x = -5 
        player1.switchSprite('run')
    } else if (keys.d.pressed && player1.lastKey === 'd') {
        player1.velocity.x = 5
        player1.switchSprite('run')
    } else {
        player1.switchSprite('idle')
    }

// player1 jump animation 
    if( player1.velocity.y < 0) {
        player1.switchSprite('jump')
    } else if ( player1.velocity.y > 0){
        player1.switchSprite('fall')
    }

// player2 movement
    if (keys.ArrowLeft.pressed && player2.lastKey === 'ArrowLeft') {
        player2.velocity.x = -5 
        player2.switchSprite('run')
    } else if (keys.ArrowRight.pressed && player2.lastKey === 'ArrowRight') {
        player2.velocity.x = 5
        player2.switchSprite('run')
    } else {
        player2.switchSprite('idle')
    }

// player 2 jump animation
    if( player2.velocity.y < 0) {
        player2.switchSprite('jump')
    } else if ( player2.velocity.y > 0){
        player2.switchSprite('fall')
    }

// successful attack player1
    if ( rectangularCollision({rectangle1: player1, rectangle2: player2}) &&
        player1.isAttacking &&
        player1.framesCurrent === 4) {
            player2.takeHit()
            player1.isAttacking = false
            gsap.to('#player2Health', {
                width: player2.health + '%'
            })
    }
// missed attack player1
if (player1.isAttacking && player1.framesCurrent === 4) {
    player1.isAttacking = false
}

// successful attack player2
    if ( rectangularCollision({rectangle1: player2, rectangle2: player1}) &&
        player2.isAttacking &&
        player2.framesCurrent === 2) {
            player1.takeHit()
            player2.isAttacking = false
            gsap.to('#player1Health', {
            width: player1.health + '%'
        })
}

// missed attack player2
if (player2.isAttacking && player2.framesCurrent === 2) {
    player2.isAttacking = false
}

//end game if health = 0
    if(player2.health <= 0 || player1.health <= 0){
        determineWinner({player1,player2,timerId})
    }

}

animation()

window.addEventListener('keydown',(event) => {
//player1 keys
if (!player1.dead) {
    switch (event.key) {
        case 'd' :
            keys.d.pressed = true
            player1.lastKey = 'd'
            break
        case 'a' :
            keys.a.pressed = true
            player1.lastKey = 'a'
            break
        case 'w' :
            player1.velocity.y = -20
            break
        case ' ':
            player1.attack()
            break
    } 
} 
//player2 keys
if (!player2.dead) {  
    switch (event.key) {
        case 'ArrowRight' :
            keys.ArrowRight.pressed = true
            player2.lastKey = "ArrowRight"
            break
        case 'ArrowLeft' :
            keys.ArrowLeft.pressed = true
            player2.lastKey = "ArrowLeft"
            break
        case 'ArrowUp' :
            player2.velocity.y = -20
            break
        case 'ArrowDown' :
            player2.attack()
            break
    }
}
    
})


window.addEventListener('keyup',(event) => {
    switch (event.key) {
        case 'd' :
            keys.d.pressed = false
            break
        case 'a' :
            keys.a.pressed = false
            break
    }

    switch (event.key) {
        case 'ArrowRight' :
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft' :
            keys.ArrowLeft.pressed = false
            break

    }
    
})

