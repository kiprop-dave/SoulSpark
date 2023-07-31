import { Router } from "express";
import { getSession, createSession } from "../utils/session";
import { generateAccessToken } from "../utils/webToken";
const authRouter = Router();


// this is the route that the client will use to obtain a user session if it exists and then
// give the user a token to use for future requests
authRouter.route('/me').get(async (req, res) => {
  const session = await getSession(req);
  if (!session) return res.status(401).send({ message: "You are not logged in." });
  const accessToken = generateAccessToken(session.id, "15m");
  res.status(200).json({
    id: session.id,
    email: session.email,
    accessToken,
  })
});


export default authRouter;
