const { Router } = require('express');
const router = Router();
const controller = require('./controller');

router.get('/', controller.getGeojson);
router.post('/', controller.geojson_data);

module.exports = router;
