app.factory('RandomGreetings', function () {

    var getRandomFromArray = function (arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    };

    var greetings = [
        'Hello, Rachel!',
        'Hello, Michael!',
        'Hello, Kyle!',
        'What beautiful day!',
        'I\'m like any other project, except that I am yours. :)',
        'Pied Pipeline. The roomba to your floor.'
    ];

    return {
        greetings: greetings,
        getRandomGreeting: function () {
            return getRandomFromArray(greetings);
        }
    };

});
