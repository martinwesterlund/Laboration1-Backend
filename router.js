const express = require('express')
const router = express.Router()

let root = {
    root: 'public/'
}



router.get('/results', (req, res) => {
    res.sendFile('results.html', root)
})

router.get('*', (req, res) => {
    if(req.query.username === 'admin' && req.query.password === 'password'){
        res.sendFile('index.html', root)
    } else{
        res.sendFile('error.html', root)
    }
   
})


module.exports = router