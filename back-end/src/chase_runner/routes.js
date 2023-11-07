const { Router } = require('express');
const router = Router();
const controller = require('./controller');

router.get('/', controller.getMarkers);
router.post('/', controller.addMarker);
module.exports = router;