import { Router } from 'express';
import { userProfileSchema } from '../../types';
import { verifyAccessTokenMiddleware } from '../../middleware/verifyAccessToken';
import { getUserProfile, createProfile } from '../../controllers/users';

const usersRouter = Router();

usersRouter.use(verifyAccessTokenMiddleware);

usersRouter
  .route('/profile/:userId')
  .get(async (req, res) => {
    // Fetch the user's profile from the database.
    const id = req.params.userId;
    try {
      const profile = await getUserProfile(id);

      if (profile === null) {
        return res.status(404).send('User not found');
      }

      return res.status(200).json(profile);
    } catch (err) {
      console.log(err);
      res.status(500).send('Server error');
    }
  })
  .post(async (req, res) => {
    try {
      const id = req.params.userId;
      console.log(req.body);
      const data = await userProfileSchema.parseAsync(req.body);
      const updatedProfile = await createProfile(id, data);
      return res.status(200).json(updatedProfile);
    } catch (err) {
      console.error('profile update', err);
      res.status(500).send('Server error');
    }
  });

export default usersRouter;
