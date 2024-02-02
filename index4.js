

// This event listener ensures that the script runs after the DOM content is fully loaded.
document.addEventListener('DOMContentLoaded', (event) => {
    // Initial setup: acquiring elements and setting initial values
    let car = document.getElementById("car");
    let gameContainer = document.getElementById("gameContainer");
    let scoreElement = document.getElementById("score");
    let score = 0; // Tracks the current score
    let jumping = false; // Indicates whether the car is currently jumping
    let gameStarted = false; // Indicates whether the game has started
    let moveInterval; // Used to control continuous movement
    let carSpeed = 10; // Defines the speed of the car's movement


    

    // Event listener for key down actions to handle car movements and jumping
    document.addEventListener("keydown", function(event) {
        if (event.key === "ArrowRight" && !moveInterval) {
            // Starts moving the car to the right
            moveInterval = setInterval(moveRight, 100);
        } else if (event.key === " ") {
            // Initiates a jump
            jump();
        }
    });

    // Event listener for key up actions to stop continuous movement
    document.addEventListener("keyup", function(event) {
        if (event.key === "ArrowRight" && moveInterval) {
            // Stops moving the car to the right
            clearInterval(moveInterval);
            moveInterval = null;
        }
    });


    
    /**
     * Function: moveRight
     * Purpose: Moves the car to the right by updating its 'x' attribute.
     */
    function moveRight() {
        let currentX = parseInt(car.getAttribute("x")) || 0;
        car.setAttribute("x", currentX + carSpeed);
    }

    // Event listener for the start button to begin the game
    document.getElementById("startBtn").addEventListener("click", startGame);

    let scoreInterval; // Used to control the score increment interval

    /**
     * Function: startGame
     * Purpose: Initializes the game by hiding the start button, starting cone addition and score increment.
     */
    function startGame() {
        if (!gameStarted) {
            gameStarted = true;
            document.getElementById("startBtn").style.display = "none";
            setInterval(addCone, 3000); // Begins adding cones at intervals
            scoreInterval = setInterval(() => { // Begins incrementing the score
                score += 10;
                scoreElement.innerText = `Score: ${score}`;
            }, 1000);
        }
    }

    /**
     * Function: jump
     * Purpose: Makes the car jump by temporarily changing its 'bottom' and 'left' styles.
     */
    function jump() {
        if (!jumping) {
            jumping = true;
            let jumpHeight = 150;
            let jumpDistance = 30;
    
            let startBottom = parseInt(window.getComputedStyle(car).getPropertyValue("bottom"));
            let startLeft = parseInt(window.getComputedStyle(car).getPropertyValue("left"));
    
            // Temporary changes for the jump animation
            car.style.bottom = (startBottom + jumpHeight) + "px";
            car.style.left = (startLeft + jumpDistance) + "px";
    
            setTimeout(function() {
                // Resets the styles after the jump
                car.style.bottom = startBottom + "px";
                car.style.left = (startLeft + jumpDistance) + "px";
                jumping = false;
            }, 600); // Duration should match the CSS animation
        }
    }


    /**
     * Function: createCone
     * Purpose: Dynamically creates an SVG cone element using createElementNS.
     * Returns: SVGElement - A new cone SVG element.
     */
     function createCone() {
        let svgNS = "http://www.w3.org/2000/svg";
        let cone = document.createElementNS(svgNS, "svg");
        cone.setAttribute("width", "20");
        cone.setAttribute("height", "40");
        cone.classList.add("cone");
        cone.style.display = "block";

        let rect = document.createElementNS(svgNS, "rect");
        rect.setAttribute("width", "20");
        rect.setAttribute("height", "40");
        rect.setAttribute("fill", "orange");
        cone.appendChild(rect);

        for (let yPos of [10, 22, 34]) {
            let line = document.createElementNS(svgNS, "rect");
            line.setAttribute("y", yPos.toString());
            line.setAttribute("width", "20");
            line.setAttribute("height", "4");
            line.setAttribute("fill", "white");
            cone.appendChild(line);
        }
    

        return cone;
    }

    /**
     * Function: addCone
     * Purpose: Adds a cone to the game and manages its movement and collision detection.
     */
     function addCone() {
        if (!gameStarted) return;
    
        let coneSvg = createCone();  
        gameContainer.appendChild(coneSvg);
    
        let moveConeInterval = setInterval(function() {
            let coneRect = coneSvg.getBoundingClientRect();
            let carRect = car.getBoundingClientRect();
    
            // Update the cone's position
            let currentRight = parseInt(window.getComputedStyle(coneSvg).getPropertyValue("right"), 10);
            coneSvg.style.right = (currentRight + 10) + "px";
    
            // Collision detection
            if (carRect.right >= coneRect.left && carRect.left <= coneRect.right &&
                carRect.bottom > coneRect.top && carRect.top < coneRect.bottom) {
                if (!jumping) {
                    gameOver();
                    clearInterval(moveConeInterval);
                    gameContainer.removeChild(coneSvg);
                }
            }
    
            // Remove cone when it goes offscreen
            if (currentRight > gameContainer.offsetWidth) {
                clearInterval(moveConeInterval);
                gameContainer.removeChild(coneSvg);
            }
        }, 50);
    }

    /**
     * Function: gameOver
     * Purpose: Ends the game by displaying a game-over message, stopping intervals, and reloading the game.
     */
    function gameOver() {
        alert("The Game is Over :( Try Again!");
        clearInterval(scoreInterval); // Stops score increment
        clearInterval(moveInterval); // Stops car movement
        location.reload(); // Reloads the game
    }
});
