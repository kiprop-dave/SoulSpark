import { Router } from 'express';
import { z } from 'zod';
import { env } from '../lib/env';
import { getSession } from '../utils/session';

const tenorRouter = Router();

const tenorSchema = z.object({
  next: z.string(),
  results: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      media_formats: z.object({
        gif: z.object({
          url: z.string(),
        }),
        tinygif: z.object({
          url: z.string(),
        }),
      }),
    })
  ),
});

// Get trending gifs
tenorRouter.route('/').get(async (req, res) => {
  const session = await getSession(req);
  if (!session) {
    return res.status(401).send('Unauthorized');
  }
  //TODO:Cache this and refresh every 10 minutes,maybe paginate?
  const response = await fetch(
    `https://tenor.googleapis.com/v2/featured?key=${env.TENOR_API_KEY}&limit=30&media_filter=minimal&ar_range=standard`
  );
  const json = await response.json();
  const validated = tenorSchema.safeParse(json);
  if (!validated.success) {
    return res.status(500).send('Internal server error');
  }
  return res.json(validated.data);
});

// Search gifs
tenorRouter.route('/search').get(async (req, res) => {
  const session = await getSession(req);
  if (!session) {
    return res.status(401).send('Unauthorized');
  }
  const query = req.query.q;
  if (!query) {
    return res.status(400).send('Bad request');
  }
  const response = await fetch(
    `https://tenor.googleapis.com/v2/search?q=${query}&key=${env.TENOR_API_KEY}&limit=30&media_filter=minimal&ar_range=standard`
  );
  const json = await response.json();
  const validated = tenorSchema.safeParse(json);
  if (!validated.success) {
    console.log(validated.error);
    return res.status(500).send('Internal server error');
  }
  return res.json(validated.data);
});

tenorRouter.route('/next').get(async (req, res) => {
  const session = await getSession(req);
  if (!session) {
    return res.status(401).send('Unauthorized');
  }
  const next = req.query.next;
  if (!next) {
    return res.status(400).send('Bad request');
  }
  const response = await fetch(
    `https://tenor.googleapis.com/v2/featured?key=${env.TENOR_API_KEY}&limit=30&media_filter=minimal&ar_range=standard&pos=${next}`
  );
  const json = await response.json();
  const validated = tenorSchema.safeParse(json);
  if (!validated.success) {
    return res.status(500).send('Internal server error');
  }
  return res.json(validated.data);
});

export default tenorRouter;
