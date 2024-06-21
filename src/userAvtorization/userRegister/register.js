
const UserModel = require('../../models/userModels/userModel.ts'); 

const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  
  try {
      const existingUser = await UserModel.findOne({ where: { email } });
      
      if (existingUser) {
        return res.status(409).send({ error: 'Email already in use' });
      }
    const newUser = await UserModel.create({
      firstName,
      lastName,
      email,
      password,
    });

    
    res.status(201).json({email: newUser.email });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An unexpected error occurred' });
  }
};

module.exports = registerUser;
