/*global $, console, window, Physics*/

// Matter.js - http://brm.io/matter-js/

// Matter module aliases
var Engine = Matter.Engine,
    World = Matter.World,
    Body = Matter.Body,
    Bodies = Matter.Bodies,
    Constraint = Matter.Constraint,
    Composites = Matter.Composites,
    MouseConstraint = Matter.MouseConstraint;

// create a Matter.js engine
var engine = Engine.create(document.getElementById('viewport'), {
  render: {
    options: {
      showAngleIndicator: true,
      showVelocity: true,
      showCollisions: true,
      wireframes: true
    }
  }
});

// add a mouse controlled constraint
var mouseConstraint = MouseConstraint.create(engine);
World.add(engine.world, mouseConstraint);

// add a stack to fall on to the catapult
var stack = Composites.stack(20, 255, 1, 6, 0, 0, function(x, y, column, row) {
  return Bodies.rectangle(x, y, 30, 30);
});

// create the catapult
var catapult = Bodies.rectangle(400, 520, 320, 20);

// add bodies to the world
World.add(engine.world, [
  stack,
  catapult,
  //Bodies.rectangle(250, 560, 20, 55, { isStatic: true }),
  //Bodies.circle(560, 100, 50, { density: 0.005 }),
  Constraint.create({ bodyA: catapult, pointB: { x: 370, y: 580 } }),
  Constraint.create({ bodyA: catapult, pointB: { x: 430, y: 580 } })
]);
 
// add some some walls to the world
var offset = 10;
World.add(engine.world, [
  Bodies.rectangle(400, -offset, 800 + 2 * offset, 50, { isStatic: true }),
  Bodies.rectangle(400, 600 + offset, 800 + 2 * offset, 50, { isStatic: true }),
  Bodies.rectangle(800 + offset, 300, 50, 600 + 2 * offset, { isStatic: true }),
  Bodies.rectangle(-offset, 300, 50, 600 + 2 * offset, { isStatic: true })
]);
  
// run the engine
Engine.run(engine);