// This route should return a list of users that the user has matched with
matchesRouter.route('/').get(async (req, res) => {
  const session = await getSession(req);
  if (!session) return res.status(401).send('Unauthorized');
  const result = await getMatches(session.id);
  if (result.status === 'success') {
    return res.status(200).json(result.data);
  }
  return res.status(500).send('Internal server error');
});
