const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();

router.get('/',  (req, res) => {
    console.log('get Questions');
        console.log(req.query);
        let userInput = req.query.search
        let searchText = '%' + userInput + '%';
        let queryText = `SELECT * FROM "questions" WHERE question_text ILIKE  $1`;
        // let queryText = `SELECT * FROM "questions" WHERE question_text LIKE `;
        pool.query(queryText, [searchText])
        .then((results) => {
            res.send(results.rows)
            console.log(results.rows);
        }).catch((err) => {
            console.log(err);
            res.sendStatus(500);
        }) 
});

router.get('/response/:id', (req, res) => {
        console.log('itsall here', req.params.id);
        
    let queryText = `SELECT * FROM "response" WHERE "questions_id"  = $1 ORDER BY "id" ASC`
    pool.query(queryText, [req.params.id]).then((results) => {
        res.send(results.rows)
        console.log(results.rows);
        
    }).catch((err) =>{
        console.log(err);
        res.sendStatus(500)
    })
});
router.get('/profile_pic', (req, res) => {
    console.log('its all here', req.user.id);
        
    let queryText = `SELECT * FROM person WHERE person."id" = $1;`
    pool.query(queryText, [req.user.id]).then((results) => {
        res.send(results.rows)
        console.log(results.rows);
        
    }).catch((err) =>{
        console.log(err);
        res.sendStatus(500)
    })
});


router.get('/username', (req, res) => {
    console.log('got something:',req.user.id);
    if(req.isAuthenticated){
        const queryText = `SELECT * FROM questions WHERE "person_id" = $1 LIMIT 3;`;
        pool.query(queryText, [req.user.id]).then((results) =>{
            res.send(results.rows);
            console.log(results.rows);
        }).catch((err) => {
            console.log(err);
            res.sendStatus(500)
        })
    }
})


router.get('/allQuestions/:id', (req, res) => {
    console.log('got something:',req.params.id);
    if(req.isAuthenticated){
        const queryText = `SELECT * FROM questions WHERE questions."id" = $1;`;
        pool.query(queryText, [req.params.id]).then((results) =>{
            res.send(results.rows);
            console.log(results.rows);
        }).catch((err) => {
            console.log(err);
            res.sendStatus(500)
        })
    }
})

router.get('/question/:id', (req, res) => {
        console.log(req.params.id);
        
        const queryText = `SELECT * FROM "questions" WHERE id= $1;`;
        pool.query(queryText, [req.params.id])
            .then((results) => {
                res.send(results.rows)
                console.log(results.rows);
                
            }).catch((err) => {
                console.log(err);
                res.sendStatus(500)
            })
})

router.get('/getMeetUps', (req, res) => {
    console.log('its here', req.body);
    
let queryText = `SELECT * FROM meet_ups WHERE "person_id"  = $1;`;
pool.query(queryText, [req.user.id]).then((results) => {
    res.send(results.rows)
    console.log(results.rows);
    
}).catch((err) =>{
    console.log(err);
    res.sendStatus(500)
})
});

/**
 * POST route template
 */
router.post('/', (req, res) => {
    console.log('got to post', req.body);
    if(req.isAuthenticated){
        const newQuestion = req.body
        const queryText = `INSERT INTO "questions" ("question_text", "type_of_sport", "question_title", "person_id") VALUES ($1, $2, $3, $4)`
        pool.query(queryText, [newQuestion.question_text, newQuestion.type_of_sport, newQuestion.question_title, req.user.id ])
            .then(() => {
                res.sendStatus(200);
            })
                .catch((err) => {
                    console.log(err);
                    res.sendStatus(500)
                })
    }else{
        res.sendStatus(403)
    }
});


router.post('/answer', (req, res) => {
    console.log(req.body);
    if(req.isAuthenticated){
        const answer = req.body
        const queryText = `INSERT INTO "response" ("comments", "questions_id", "person_id") VALUES ($1, $2, $3)`
        pool.query(queryText, [answer.state.comments, answer.id, req.user.id])
        .then(() => {
            res.sendStatus(201)
        }).catch((err) => {
            console.log(err);
        })
    }
})

router.post('/meetup', (req, res) => {
    console.log('got to post', req.body);
    if(req.isAuthenticated){
        const newMeetUp = req.body
        const queryText = `INSERT INTO "meet_ups" ("meet_up_text", "meet_up_location", "person_id") VALUES ($1, $2, $3)`
        pool.query(queryText, [newMeetUp.meet_up_text, newMeetUp.meet_up_location, req.user.id ])
            .then(() => {
                res.sendStatus(200);
            })
                .catch((err) => {
                    console.log(err);
                    res.sendStatus(500)
                })
    }else{
        res.sendStatus(403)
    }
});
router.delete('/:id', (req, res) => {
    console.log('hello',req.params.id);
    console.log(req.user.id);
    
    
    if (req.isAuthenticated){
        const queryText = `DELETE FROM "questions" WHERE questions."id" = $1 AND "person_id" = $2;`;
        pool.query(queryText,[req.params.id , req.user.id])
        .then(() => {
            res.sendStatus(201);
            console.log('I work!');
            
        }).catch((err) => {
            console.log('error deleting', err);
            res.sendStatus(500)
        })
    }
})

router.delete('/answerDelete/:id', (req, res) => {
    console.log(req.params.id);
    if(req.isAuthenticated){
        const queryText = `DELETE  FROM response WHERE response."id" = $1 AND "person_id" = $2;`;
        pool.query(queryText, [req.params.id, req.user.id]).then(() => {
            res.sendStatus(201)
            console.log('deleting');
        }).catch((err) => {
            console.log('problem in router answer delete', err);
            res.sendStatus(500)
        })
    }
})

router.put('/', (req, res) => {
    console.log('got to put', req.body.url);
    if(req.isAuthenticated){
        const queryText = `UPDATE "person" SET "profile_picture" = $1 WHERE "id" = $2;`;
        pool.query(queryText, [req.body.url, req.user.id])
        .then(() => {
            res.sendStatus(200); 
        })
        .catch((err) => {
            console.log('Error updating Profile picture', err);
            res.sendStatus(500)
        })
    }else{
        res.sendStatus(403);
    }
})

    router.put('/bio/:id', (req, res) => {
        console.log('got to put', req.params.id);
        if(req.isAuthenticated){
            const queryText = `UPDATE person SET "profile_bio" = $1 WHERE "id" = $2`
            pool.query(queryText, [req.params.id, req.user.id])
            .then(() => {
                res.sendStatus(201)
                
            }).catch((err) => {
                console.log('error updating bio', err);
                res.sendStatus(500)
            })
        }else{
            res.sendStatus(403)
        }
    })

    router.put('/likes', (req, res) => {
        console.log(req.body);
        if(req.isAuthenticated){
            const queryText = `UPDATE questions SET "question_likes" = $1 WHERE "id" = $2;`;
            pool.query(queryText, [req.body.questionLike, req.body.id]).then(() => {
                res.sendStatus(201)
            })
       }else{
            res.sendStatus(403)
        }
    })

    router.put('/meetUpPhoto', (req, res) => {
        console.log('got to put', req.body);
        if(req.isAuthenticated){
            const queryText = `UPDATE "meet_ups" SET "meet_up_photo" = $1 WHERE "id" = $2;`;
            pool.query(queryText, [req.body.url, req.user.id])
            .then(() => {
                res.sendStatus(200); 
            })
            .catch((err) => {
                console.log('Error updating Profile picture', err);
                res.sendStatus(500)
            })
        }else{
            res.sendStatus(403);
        }
    })

module.exports = router;