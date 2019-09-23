const express = require('express');
const router = express.Router();


// @route   GET user/test
// @desc    Tests users route
// @access  Public

router.get('/test', (req,res) =>{
   res.json({
       msg : "works"
   })
});

module.exports = router;