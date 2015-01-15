/*global $, console, window, Matter, document*/

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
            wireframes: false
        }
    }
});

// add a mouse controlled constraint
var mouseConstraint = MouseConstraint.create(engine);
World.add(engine.world, mouseConstraint);

// add a stack to fall on to the catapult
var stack = Composites.stack(20, 255, 1, 6, 0, 0, function(x, y, column, row) {
    console.log(row);
    return Bodies.rectangle(x, y, 30, 30, {friction: 0.9});
});


// create the catapult
var catapult = Bodies.rectangle(400, 520, 246, 20, {
    friction: 1,
    render: {
        sprite: {
            texture: 'assets/catapult.png'
        }
    }
});

// add bodies to the world
World.add(engine.world, [
    stack,
    catapult,
    Bodies.rectangle(280, 560, 20, 55, { isStatic: true }),
    //Bodies.circle(560, 100, 50, { density: 0.005 }),
    Constraint.create({ bodyA: catapult, pointB: { x: 370, y: 580 }, stiffness: 2 }),
    Constraint.create({ bodyA: catapult, pointB: { x: 380, y: 580 }, stiffness: 2 }),
    Constraint.create({ bodyA: catapult, pointB: { x: 430, y: 580 }, stiffness: 2 }),
    Constraint.create({ bodyA: catapult, pointB: { x: 435, y: 580 }, stiffness: 2 }),
    Constraint.create({ bodyA: catapult, pointB: { x: 385, y: 580 }, stiffness: 2 }),
    Constraint.create({ bodyA: catapult, pointB: { x: 420, y: 580 }, stiffness: 2 })
]);

// add some some walls to the world
var offset = 10;
World.add(engine.world, [
    //Body.create(20, 255, { bounds:  }),
    Bodies.rectangle(400, -offset, 800 + 2 * offset, 50, { isStatic: true }),
    Bodies.rectangle(400, 600 + offset, 800 + 2 * offset, 50, { isStatic: true }),
    Bodies.rectangle(800 + offset, 300, 50, 600 + 2 * offset, { isStatic: true }),
    Bodies.rectangle(-offset, 300, 50, 600 + 2 * offset, { isStatic: true })
]);

// run the engine
Engine.run(engine);

Array.prototype.equals = function (array) {
    "use strict";
    if (!array) {
        return false;
    }

    if (this.length !== array.length) {
        return false;
    }

    var i, l;

    for (i = 0, l = this.length; i < l; i += 1) {
        // Check if we have nested arrays
        if (this[i] instanceof Array && array[i] instanceof Array) {
            // recurse into the nested arrays
            if (!this[i].equals(array[i])) {
                return false;
            }
        } else if (this[i] !== array[i]) {
            // Warning - two different object instances will never be equal: {x:20} != {x:20}
            return false;
        }
    }
    return true;
};
Array.prototype.r = function () {
    "use strict";
    return this[Math.floor(Math.random() * this.length)];
};
Array.prototype.shuffle = function () {
    "use strict";
    var i = this.length, j, temp;
    if (i === 0) {
        return this;
    }
    while (i) {
        j = Math.floor(Math.random() * (i + 1));
        temp = this[i];
        this[i] = this[j];
        this[j] = temp;

        i -= 1;
    }
    return this;
};
String.prototype.format = function () {
    "use strict";
    var args = arguments;
    return this.replace(/\{(\d+)\}/g, function (match, number) {
        return args[number] !== undefined
            ? args[number]
            : match;
    });
};

var Game = {
    densities: [1, 2, 3],
    positions: [1, 2, 3, 4, 5],
    level: [1, 2],
    type: [1, 2],       // Position Problem, Mass Problem

    question_cache: {
        one: {
            one: "One object of mass m = {0}, is placed at marker {1} to the left of the fulcrum. Which of the following (Position, Mass) pair can balance the Lever?",
            two: "Two objects of masses m1 = {0}, and m2 = {1}, are placed at markers {2} and {3}, respectively to the left of the fulcrum. Which of the following (Position, Mass) pair can balance the Lever?"
        },
        two : {
            one: "One object of mass m = {0}, is placed at marker {1} to the left of the fulcrum. Where should the object of Mass m = {2} be placed to balance the Lever?",
            two: "Two objects of masses m1 = {0}, and m2 = {1}, are placed at markers {2} and {3}, respectively to the left of the fulcrum. Where should the object of Mass m = {4} be placed to balance the Lever?"
        }
    },

    current: {
        level: 1,
        answer: undefined,
        question: undefined,
        question_str: undefined,
        type: undefined
    },
    left: function () {
        "use strict";
        var out = [], i;
        for (i = 0; i < Game.current.level; i += 1) {
            out.push([Game.positions.r(), Game.densities.r()]);
        }
        Game.current.question = out;
        return out;
    },

    right: function () {
        "use strict";
        var i, j, MI_left = 0, MI_temp, out = [], left = Game.current.question;
        for (i = 0; i < left.length; i += 1) {
            MI_left += left[i][0] * left[i][1];
        }

        for (i = 0; i < Game.positions.length; i += 1) {
            for (j = 0; j < Game.densities.length; j += 1) {
                MI_temp = Game.positions[i] * Game.densities[j];
                if (MI_temp === MI_left) {
                    out.push([Game.positions[i], Game.densities[j]]);
                }
            }
        }

        Game.current.answer = out;
        return out;
    },

    generate_question: function () {
        "use strict";
        Game.left();
        Game.right();

        var type = Game.type.r();

        Game.current.type = type;

        if (type === 1) {
            if (Game.current.level === 1) {
                Game.current.question_str = Game.question_cache.one.one.format(
                    Game.current.question[0][1],
                    Game.current.question[0][0]
                );
            } else if (Game.current.level === 2) {
                Game.current.question_str = Game.question_cache.one.two.format(
                    Game.current.question[0][1],
                    Game.current.question[1][1],
                    Game.current.question[0][0],
                    Game.current.question[1][0]
                );
            } else {
                Game.current.question_str = "Error.";
            }
        } else if (type === 2) {
            if (Game.current.level === 1) {
                Game.current.question_str = Game.question_cache.two.one.format(
                    Game.current.question[0][1],
                    Game.current.question[0][0],
                    Game.current.answer[0][1]
                );
            } else if (Game.current.level === 2) {
                Game.current.question_str = Game.question_cache.two.two.format(
                    Game.current.question[0][1],
                    Game.current.question[1][1],
                    Game.current.question[0][0],
                    Game.current.question[1][0],
                    Game.current.answer[0][1]
                );
            } else {
                Game.current.question_str = "Error.";
            }
        } else {
            Game.current.question_str = "Error";
        }

        return Game.current;
    },

    generate_different_option: function (option) {
        "use strict";
        var b = [Game.positions.r(), Game.densities.r()];
        if (option.equals(b)) {
            return Game.generate_different_option(option);
        }
        return b;
    },

    generate_answers: function () {
        "use strict";
        var ans = Game.current.answer;

        if (Game.current.type === 1) {
            // mcq
        }
    }
};