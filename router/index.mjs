import { Router } from "express";
import Controller from "../controllers/controller.mjs";
const router = new Router();

// test express
router.get("/", (req, res) => {
    res.send("Hello World!");
});

// create customer
router.post("/customers", Controller.createCustomer);
// get all customer sort by name A-Z
router.get("/customers", Controller.getAllCustomer);
// update customer by id
router.put("/customers/:id", Controller.updateCustomer);
// delete customer by id
router.delete("/customers/:id", Controller.deleteCustomer);
// create transaction
router.post("/transactions", Controller.createTransaction);
// get all transaction and search query
router.get("/transactions", Controller.getAllTransaction);



export default router;