function status(req, res) {
  if (!req.user) return res.json({ authenticated: false, user: null });
  return res.json({ authenticated: true, user: req.user });
}

function logout(req, res, next) {
  const completeLogout = () => {
    if (req.session) {
      req.session.destroy(() => {
        res.clearCookie("connect.sid");
        res.json({ message: "Logged out" });
      });
    } else {
      res.clearCookie("connect.sid");
      res.json({ message: "Logged out" });
    }
  };

  if (typeof req.logout === "function") {
    req.logout((err) => {
      if (err) return next(err);
      completeLogout();
    });
  } else {
    completeLogout();
  }
}

module.exports = { status, logout };
