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
            wireframes: false,
            width: 500,
            height: 300
        }
    }
});

// add a mouse controlled constraint
var mouseConstraint = MouseConstraint.create(engine);
World.add(engine.world, mouseConstraint);

// create the catapult
var catapult = Bodies.rectangle(250, 250, 250, 20, {
    friction: 1,
    restitution: 0,
    render: {
        sprite: {
            texture: 'assets/catapult.png'
        }
    }
});

var position = {
    left: {
        1: 230,
        2: 212,
        3: 190,
        4: 168,
        5: 149
    },
    right: {
        1: 270,
        2: 292,
        3: 190,
        4: 168,
        5: 149
    }
};


// add bodies to the world
World.add(engine.world, [
    catapult,
    Constraint.create({ bodyA: catapult, pointB: { x: 230, y: 300 }, stiffness: 2 }),
    Constraint.create({ bodyA: catapult, pointB: { x: 240, y: 300 }, stiffness: 2 }),
    Constraint.create({ bodyA: catapult, pointB: { x: 260, y: 300 }, stiffness: 2 }),
    Constraint.create({ bodyA: catapult, pointB: { x: 270, y: 300 }, stiffness: 2 }),
    Bodies.rectangle(250, 0, 500, 2, { isStatic: true }),
    // left
    Bodies.rectangle(500, 150, 2, 300, { isStatic: true }),
    // bottom
    Bodies.rectangle(250, 300, 500, 2, { isStatic: true }),
    // right
    Bodies.rectangle(0, 150, 2, 300, { isStatic: true }),
    Bodies.circle(position.left[1], 200, 8, { isStatic: false, friction: 1, restitution: 0.5 }),
    Bodies.circle(position.right[1], 200, 8, { isStatic: false, friction: 1, restitution: 0.5 }),
]);

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
        i -= 1;
        j = Math.floor(Math.random() * (i + 1));
        temp = this[i];
        this[i] = this[j];
        this[j] = temp;
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
        answer_id: undefined,
        answer_str: undefined,
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

        if (out.length === 0) {
            return Game.generate_question();
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

        Game.current.options_str = Game.generate_answers_draw_question();

        $("#answer").slideUp();

        return Game.current;
    },

    generate_different_option: function () {
        "use strict";
        var b = [Game.positions.r(), Game.densities.r()], dont_proceed = false, i;

        for (i = 0; i < arguments.length; i += 1) {
            dont_proceed = dont_proceed || b.equals(arguments[i]);
        }

        if (dont_proceed) {
            return Game.generate_different_option(arguments);
        }
        return b;
    },

    generate_answers_draw_question: function () {
        "use strict";
        var ans = Game.current.answer, opt_0, opt_1, opt_2, opt_3, options, i;
        opt_0 = ans[0];
        opt_1 = Game.generate_different_option(opt_0);
        opt_2 = Game.generate_different_option(opt_0, opt_1);
        opt_3 = Game.generate_different_option(opt_0, opt_1, opt_2);
        options = [opt_0, opt_1, opt_2, opt_3].shuffle();

        $("#quest").html(Game.current.question_str);

        if (Game.current.type === 1) {
            for (i = 0; i < 4; i += 1) {
                $("#opt_" + i).html(JSON.stringify(options[i]));
                if (options[i].equals(ans[0])) {
                    Game.current.answer_id = "#opt_" + i;
                    Game.current.answer_str = JSON.stringify(options[i]);
                }
            }
        } else if (Game.current.type === 2) {
            for (i = 0; i < 4; i += 1) {
                $("#opt_" + i).html(options[i][0]);
                if (options[i].equals(ans[0])) {
                    Game.current.answer_id = "#opt_" + i;
                    Game.current.answer_str = options[i][0];
                }
            }
        }
        return options;
    },

    check_answer: function (id) {
        "use strict";
        if (id === Game.current.answer_id) {
            $("#answer").text("Correct!");
        } else {
            $("#answer").text("Sorry, Correct Answer is " + Game.current.answer_str);
        }
        $("#answer").slideDown();
    },

    create_handler: function (id) {
        "use strict";
        $(id).click(function () {
            Game.check_answer(id);
        });
    },

    init: function () {
        "use strict";
        // attach click events:
        var i;
        for (i = 0; i < 4; i += 1) {
            Game.create_handler("#opt_" + i);
        }
        // draw a question:
        Game.generate_question();
    }
};

Game.init();