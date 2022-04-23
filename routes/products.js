const router = require("express").Router();
const verify = require("./verifyToken");

router.get("/", verify, (req, res) => {
  res.json({
    products: {
      title: "Pet Shampoo",
      description: "Good shampoo for all types of hairs",
    },
  });
});

module.exports = router;
