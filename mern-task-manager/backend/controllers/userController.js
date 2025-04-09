exports.getAllUsers = async (req, res) => {
  try {
    res.json({ message: "All users endpoint" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    res.json({ message: "Create user endpoint" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};