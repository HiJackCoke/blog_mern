const express = require('express');
const router = express.Router();

// @route   GET profile/test
// @desc    Tests profile route
// @access  Public

router.get('/test', (req,res) => {
   res.json({
       msg : "works"
   });
});




module.exports = router;