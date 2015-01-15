
var Engine = Matter.Engine,
    World = Matter.World,
    Body = Matter.Body,
    Bodies = Matter.Bodies,
    Constraint = Matter.Constraint,
    Composites = Matter.Composites,
    MouseConstraint = Matter.MouseConstraint;

// create a Matter.js engine
var engine = Engine.create(document.getElementById("sim"), {
  render: {
    options: {
      showAngleIndicator: true,
      wireframes: false,
      height: 500,
      width: 960
    }
  }
});

// add a mouse controlled constraint
var mouseConstraint = MouseConstraint.create(engine);
World.add(engine.world, mouseConstraint);

// a few settings
var rows = 10,
    yy = 600 - 21 - 40 * rows;


// create the wrecking ball
var ball = Bodies.circle(400, 200, 50, { density: 0.0001, frictionAir: 0});

// create the rope the ball will swing on
var ballRope = Constraint.create({
  pointA: { x: 480, y: 0 },
  bodyB: ball,
  stiffness: 0.01
});

// add all of the bodies to the world
World.add(engine.world, [ball, ballRope]);

// run the engine
Engine.run(engine);