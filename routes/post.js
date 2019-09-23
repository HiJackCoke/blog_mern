const express = require('express');
const router = express.Router();

// @route   GET post/test
// @desc    Tests post route
// @access  Public

router.get('/test', (req, res)=> {
   res.json({
      msg : "works"
   });
});



module.exports = router;