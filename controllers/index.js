const bcrypt = require("bcrypt");
const User = require("../models").User;

const homeIndex = (req, res) => {
    const { nama } = req.session;
    res.render("index.ejs", { nama, loggedIn: req.session.authenticate });
};

const loginIndex = (req, res) => {
    res.render("login.ejs", { loggedIn: req.session.authenticate });
    // if (req.session.authenticate) {
    //     res.redirect("/");
    // } else {
    //     res.render("login.ejs");
    // }
};

const loginAction = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.render("login.ejs", {
            error: "Isi dong Email dan Passwordnya",
            loggedIn: req.session.authenticate,
        });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
        res.render("login.ejs", {
            error: "Tidak ada User ini!",
            loggedIn: req.session.authenticate,
        });
    } else {
        const isPassValid = await bcrypt.compare(password, user.password);
        if (!isPassValid) {
            res.render("login.ejs", {
                error: "Passwordnya salah!",
                loggedIn: req.session.authenticate,
            });
            return;
        }

        req.session.authenticate = true;
        req.session.nama = user.firstName;
        req.session.userId = user.id;

        res.redirect("/");
    }
};

const logoutAction = (req, res) => {
    if (req.session.authenticate) {
        req.session.destroy((err) => {
            console.log("Error");
        });
    }
    res.redirect("/");
};

const registerIndex = (req, res) => {
    if (!req.session.authenticate) {
        res.render("register.ejs", { loggedIn: req.session.authenticate });
    }
    res.redirect("/");
};

const registerAction = async (req, res) => {
    const { firstName, lastName, email, password, repeatPassword, dateOfBirth, gender } = req.body;
   if (!firstName || !lastName || !email || !password || !repeatPassword || !dateOfBirth || !gender ) {
        res.render("register.ejs", {
            error: "Isi dulu semuanya",
            loggedIn: req.session.authenticate,
        });
    }
    return;

    const existingUser = await User.findOne({ where: { email } });

    if (existingUser) {
        res.render("register.ejs", {
            error: "Email sudah terdaftar, pakailah email lain",
            loggedIn: req.session.authenticate,
        });
    } else if (password !== repeatPassword) {
        res.render("register.ejs", {
            error: "Password tidak sama!",
            loggedIn: req.session.authenticate,
        });
    } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            dateOfBirth,
            gender
        });
        if (newUser) {
            res.redirect("/login");
        }
    }
};

const idIndex = (req, res) => {
    const { id } = req.params;
    res.send(`Access Route with params (${id})`);
};

const profileIndex = async (req, res) => {
    if (req.session.authenticate) {
      const { userId } = req.session;
      const user = await User.findOne({ where: { id: userId } });
      res.render("profile/profile.ejs", { loggedIn: true, user, firstName, lastName, email, dateOfBirth, gender });
    } else {
      res.redirect("/");
    }
  };
  
  const editProfileIndex = async (req, res) => {
    if (req.session.authenticate) {
      const { userId } = req.session;
      const user = await User.findOne({ where: { id: userId } });
      res.render("profile/edit-profile.ejs", { loggedIn: true, user });
    } else {
      res.redirect("/");
    }
  };
  
  const editProfileAction = async (req, res) => {
    if (req.session.authenticate) {
      const { firstName, lastName, email } = req.body;
      const { userId } = req.session;
      await User.update(
        { firstName, lastName, email },
        { where: { id: userId } }
      );
      res.redirect("/");
    } else {
      res.redirect("/");
    }
  };
  
  const deleteProfileAction = async (req, res) => {
    if (req.session.authenticate) {
      const { userId } = req.session;
      await User.destroy({ where: { id: userId } });
      req.session.destroy((err) => {
        console.log("Error");
      });
      res.redirect("/");
    } else {
      res.redirect("/");
    }
  };  

module.exports = {
    homeIndex,
    loginIndex,
    loginAction,
    idIndex,
    logoutAction,
    registerIndex,
    registerAction,
    profileIndex,
    editProfileIndex,
    editProfileAction
};
