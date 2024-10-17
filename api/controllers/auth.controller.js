import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return next(errorHandler(400, 'Username, email, and password are required'));
    }

    if (typeof username !== 'string' || typeof email !== 'string' || typeof password !== 'string') {
        return next(errorHandler(400, 'Username, email, and password must be strings'));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    try {
        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        next(error);
    }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) return next(errorHandler(404, 'user not found'));

        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) return next(errorHandler(401, 'wrong credentials'));

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const { password: hashedPassword, ...rest } = validUser._doc;
        const expiryDate = new Date(Date.now() + 3600000); //1 hour

        res
            .cookie('access_token', token, { httpOnly: true, expires: expiryDate })
            .status(200)
            .json({ rest });
    } catch (error) {
        next(error);
    }
};


export const googlelogin = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const { password: hashedPassword, ...rest } = user._doc;
      const expiryDate = new Date(Date.now() + 3600000); // 1 hour
      res
        .cookie('access_token', token, { httpOnly: true, expires: expiryDate })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const salt = bcryptjs.genSaltSync(12);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, salt);
      
      // Fixed username generation
      const baseUsername = req.body.name.split(' ').join('').toLowerCase();
      const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
      const username = `${baseUsername}${randomSuffix}`;

      const newUser = new User({
        username,
        email: req.body.email,
        password: hashedPassword,
        profilePicture: req.body.photoUrl
      });
      await newUser.save();
      
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const expiryDate = new Date(Date.now() + 3600000); // 1 hour
      const { password, ...userWithoutPassword } = newUser._doc;
      res
        .cookie('access_token', token, { httpOnly: true, expires: expiryDate })
        .status(200)
        .json(userWithoutPassword);
    }
  } catch (error) {
    console.error('Google login error:', error);
    next(error);
  }
};

// export const googlelogin = async (req, res, next) => {
//   try {
//     const user = await User.findOne({ email: req.body.email });
//     if (user) {
//       // User exists, send a flag to indicate this
//       res.status(200).json({ exists: true });
//     } else {
//       const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
//       const salt = bcryptjs.genSaltSync(12);
//       const hashedPassword = bcryptjs.hashSync(generatedPassword, salt);
      
//       // Fixed username generation
//       const baseUsername = req.body.name.split(' ').join('').toLowerCase();
//       const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
//       const username = `${baseUsername}${randomSuffix}`;

//       const newUser = new User({
//         username,
//         email: req.body.email,
//         password: hashedPassword,
//         profilePicture: req.body.photoUrl
//       });
//       await newUser.save();
      
//       const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//       const expiryDate = new Date(Date.now() + 3600000); // 1 hour
//       const { password, ...userWithoutPassword } = newUser._doc;
//       res
//         .cookie('access_token', token, { httpOnly: true, expires: expiryDate })
//         .status(200)
//         .json({ ...userWithoutPassword, exists: false });
//     }
//   } catch (error) {
//     console.error('Google login error:', error);
//     next(error);
//   }
// };
// export const googlelogin = async (req, res, next) => {
//   try {
//     const user = await User.findOne({ email: req.body.email });
//     if (user) {
//       const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//       const { password: hashedPassword, ...rest } = user._doc;
//       const expiryDate = new Date(Date.now() + 3600000); // 1 hour
//       res
//         .cookie('access_token', token, { httpOnly: true, expires: expiryDate })
//         .status(200)
//         .json({ ...rest, exists: true });
//     } else {
//       const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
//       const salt = bcryptjs.genSaltSync(12);
//       const hashedPassword = bcryptjs.hashSync(generatedPassword, salt);
      
//       // Fixed username generation
//       const baseUsername = req.body.name.split(' ').join('').toLowerCase();
//       const randomSuffix = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
//       const username = `${baseUsername}${randomSuffix}`;

//       const newUser = new User({
//         username,
//         email: req.body.email,
//         password: hashedPassword,
//         profilePicture: req.body.photoUrl
//       });
//       await newUser.save();
      
//       const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//       const expiryDate = new Date(Date.now() + 3600000); // 1 hour
//       const { password, ...userWithoutPassword } = newUser._doc;
//       res
//         .cookie('access_token', token, { httpOnly: true, expires: expiryDate })
//         .status(200)
//         .json({ ...userWithoutPassword, exists: false });
//     }
//   } catch (error) {
//     console.error('Google login error:', error);
//     next(error);
//   }
// };