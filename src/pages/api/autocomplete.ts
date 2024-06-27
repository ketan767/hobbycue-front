import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { input } = req.query;

  if (!input) {
    return res.status(400).json({ error: 'Input is required' });
  }

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&key=AIzaSyCSFbd4Cf-Ui3JvMvEiXXs9xfGJaveKO_Y`
    );
    return res.status(200).json(response.data);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
