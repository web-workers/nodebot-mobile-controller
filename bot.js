var five = require("johnny-five");
var EtherPortClient = require("etherport-client").EtherPortClient;

var Bot = {
    leftFwd: function() {},
    leftRev: function() {},
    rightFwd: function() {},
    rightRev: function() {},
    init: init
};

function init(cb) {

    var bot = new five.Board({
        port: new EtherPortClient({
            host: "192.168.2.158", // Put your individual IP address here.
            port: 3030
        }),
        timeout: 1e5
    });

    bot.on("ready", function () {

        // The following code will blink the LED on the WeMos board to indicate that the code is working.
        var state = 1;
        setInterval(function () {
            this.digitalWrite(2, (state ^= 1));
        }.bind(this), 500);


        // Use Johnny-Five to create an instance of the left motor.
        var leftWheel = new five.Motor({
            pins: {
                pwm: 0,
                dir: 4
            },
            invertPWM: true
        });

        // Use Johnny-Five to create an instance of the right motor
        var rightWheel = new five.Motor({
            pins: {
                pwm: 13,
                dir: 12
            },
            invertPWM: true
        });

        Bot.leftFwd = function(speed) {
            speed ? leftWheel.fwd(speed) : leftWheel.stop();
        };

        Bot.rightFwd = function(speed) {
            speed ? rightWheel.fwd(speed) : rightWheel.stop();
        };

        Bot.leftRev = function(speed) {
            speed ? leftWheel.rev(speed) : leftWheel.stop();
        };

        Bot.rightRev = function(speed) {
            speed ? rightWheel.rev(speed) : rightWheel.stop();
        };

        cb();
    });

}

module.exports = Bot;