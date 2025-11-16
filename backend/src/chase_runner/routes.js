const { Router } = require('express');
const router = Router();
const controller = require('./controller');

router.get('/', controller.getGeojson);
router.post('/', controller.geojson_data);
router.post('/users', controller.createUser);
router.get('/users/:user_sub', controller.getUser);
router.put('/users/:user_sub/profile-picture', controller.updateProfilePicture);
router.put('/users/:user_sub', controller.updateUser);


module.exports = router;
