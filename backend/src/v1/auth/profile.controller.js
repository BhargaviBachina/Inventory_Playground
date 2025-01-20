const db = require('../../../config/db');

const updateProfilePicture = (req, res) => {
  console.log('File:', req.file); // Debugging log
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  const profilePicUrl = req.file.location;
  const userId = req.user.user_id;

  db('users')
    .where({ user_id: userId })
    .update({ profile_pic: profilePicUrl })
    .then(() => res.status(200).json({ message: 'Profile picture updated', profilePicUrl }))
    .catch((err) =>
      res.status(500).json({ message: 'Failed to update profile picture', error: err })
    );
};

module.exports = { updateProfilePicture };
