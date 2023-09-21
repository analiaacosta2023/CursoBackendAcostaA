import { Router } from "express";
import UserManager from "../dao/db-managers/userManager.js";

const userManager = new UserManager()

const router = Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userManager.login(email, password)
        req.session.user = {
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            rol: user.rol
        }
        res.send({ status: "success", payload: req.session.user })
    } catch (error) {
        return res.status(400).send({ status: "error", error: "credenciales incorrectas" });
    }
})

router.post('/register', async (req, res) => {
    const { first_name, last_name, email, password } = req.body;

    try {
        const user = {
            first_name, last_name, email, password
        };
        let result = await userManager.saveUser(user);
        res.send({ status: "success", message: "User registered" })

    } catch (error) {
        return res.status(400).send({ status: "error", error: error.message });
    }

})


router.get('/logout', (req, res) => {

    req.session.destroy((err) => {
        if (err) {
          return res.status(500).send({ status: 'error', error: 'Internal Server Error' });
        }
        
        res.redirect('/login');
      });
});

export default router;