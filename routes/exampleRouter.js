var express = require('express');

//Require DB Models
// var Users = require('../models/userModel');
var Ticket = require('../models/ticketModel');

var playboardRouter = express.Router();

var playboard = [
    {
        "id": "2602181",
        "game": "649",
        "no": [1, 3, 50],
        "user_id": 1,
        "status": 0,
        "variants": {

            "A": {
                "played": [20, 4, 18, 22, 47, 1],
                "hits": [],
                "win": []
            },
            "B": {
                "played": [20, 4, 18, 22, 47, 1],
                "hits": [],
                "win": []
            },
            "C": {
                "played": [7, 9, 25, 33, 37, 49],
                "hits": [],
                "win": []
            }

        },
        "lucky": {
            "played": "",
            "hits": "125",
            "win": ["III", "840"]
        },
        "game_date": "01-02-2018",
        "price": "14.4",
        "winnings": "0"

    },
    {
        "id": "2602182",
        "game": "649",
        "no": [3, 3, 50],
        "user_id": 1,
        "status": 1,
        "variants": {

            "A": {
                "played": [20, 4, 18, 22, 47, 1],
                "hits": [20, 4],
                "win": []
            },
            "B": {
                "played": [20, 4, 18, 22, 47, 1],
                "hits": [20],
                "win": []
            }

        },
        "lucky": {
            "played": "123467",
            "hits": "",
            "win": []
        },
        "game_date": "01-02-2018",
        "price": "9.6",
        "winnings": "0"

    },
    {
        "id": "2602185",
        "game": "649",
        "no": [4, 3, 50],
        "user_id": 1,
        "status": 3,
        "variants": {

            "A": {
                "played": [20, 4, 18, 22, 47, 1],
                "hits": [20, 4, 47],
                "win": ["IV", "30"]
            }

        },
        "lucky": {
            "played": "",
            "hits": "",
            "win": ["III", "840"]
        },
        "game_date": "01-02-2018",
        "price": "4.8",
        "winnings": "30"

    },
    {
        "id": "2602183",
        "game": "649",
        "no": [2, 3, 50],
        "user_id": 1,
        "status": 2,
        "variants": {

            "A": {
                "played": [20, 4, 18, 22, 47, 1],
                "hits": [20, 4, 47],
                "win": ["IV", "30"]
            }

        },
        "lucky": {
            "played": "",
            "hits": "",
            "win": ["III", "840"]
        },
        "game_date": "01-02-2018",
        "price": "4.8",
        "winnings": "30"

    }
]

playboardRouter.route('/')
    .get(function (req, res, next) {


        // res.json('User id: ' + req.decoded.user_id);
        res.end(JSON.stringify(playboard));
        next();
    })

;


//Get all ticket for specific user and specific game
playboardRouter.route('/:u_id/:g_id')
    .get(function (req, res, next) {
        var u_id = req.params.u_id,
            game_id = req.params.g_id,
            idFromDecoded = req.decoded.user_id;

        if(u_id != idFromDecoded){
            var error = "You are signed as user id: " + idFromDecoded + " you can't get tickets for user id: " + u_id;
        }

        Ticket.find({user_id:idFromDecoded, game: game_id})
            .sort({number: -1})
            .exec(
                function (err, data) {
                    if (err) throw err;
                    var result = JSON.stringify({
                        'success': true,
                        'data': data,
                        "error":error
                    });

                    res.end(result);
                })


    })

    .post(function (req, res, next) {
        var u_id = req.params.u_id,
            game_id = req.params.g_id,
            status = req.body.status,
            for_game = req.body.for_game,
            price = req.body.price,
            my_lucky = req.body.my_lucky,
            variants = req.body.variants,
            extra = req.body.extra,
            idFromDecoded = req.decoded.user_id;


        if(u_id !== idFromDecoded ) {
            var error = "You are signed as user id: " + idFromDecoded + " you can't post tickets for user id: " + u_id;
        }

        Ticket.find({user_id:idFromDecoded, game: game_id}).count(function (err, count) {
            Ticket.create({
                'game': game_id,
                'number': count + 1,
                'user_id': idFromDecoded,
                'status': status,
                'for_game': for_game,
                'price': price,
                'my_lucky': my_lucky,
                'variants': variants,
                'extra': extra

            }, function (err, data) {
                if (err) throw err;
                var result = JSON.stringify({
                    'success': true,
                    'data': data,
                    "msg":error
                });

                res.end(result);
            });
        });


    })
;

//Get specific ticket for specific game for specific user
playboardRouter.route('/:u_id/:g_id/:t_id')
    .get(function (req, res, next) {
        var u_id = req.decoded.user_id;
        var game_id = req.params.g_id;
        var ticket_id = req.params.t_id;

        Ticket.findOne({_id:ticket_id, user_id: u_id}
            , function (err, data) {
                if (err) throw err;
                var result = JSON.stringify({
                    "success": true,
                    "data": data
                });
                res.end(result);
            });
    })

    .put(function (req, res, next) {
        var u_id = req.params.u_id;
        var game_id = req.params.game_id;
        var ticket_id = req.params.t_id;

        var update = req.body.update;
        console.log(update);
        var what = update.what,
            data = update.data;

        console.log(data);

        switch(what) {
            case "extra.played":
                Ticket.findOneAndUpdate({_id: ticket_id}, {$set:{"extra.played":data}}, function (err, data) {
                    if (err) return handleError(err);
                    res.end(JSON.stringify(data));
                });
                break;
            case "status":
                Ticket.findOneAndUpdate({_id: ticket_id}, {$set:{status:data}}, function (err, data) {
                    if (err) return handleError(err);
                    res.end(JSON.stringify(data));
                });
                break;

        }




    })
;

module.exports = playboardRouter;