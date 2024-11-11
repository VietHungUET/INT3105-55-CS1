const express = require('express');
const router = express.Router();
const axios = require('axios');
const registry = require('./registry');

router.all('/:apiName/:path', (req, res) => {
    if (registry.services[req.params.apiName]) {
        axios({
            method: req.method,
            url: registry.services[req.params.apiName].url + req.params.path,
            headers: req.headers,
            data: req.body
        }).then(
            (response) => {
                console.log(response.data);
                res.send(response.data);

            })
    }
    else {
        res.send("API Name doesn't exist")
    }
}
)

module.exports = router;