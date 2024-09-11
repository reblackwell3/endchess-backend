import axios from 'axios';
import { sign } from 'jsonwebtoken';
import { Request, Response } from 'express';
import { IUser } from 'endchess-models';

export const setup = async (req: Request, res: Response) => {
  try {
    const user = req.user as IUser;
    const token = sign(
      user.providerId,
      process.env.SHARED_SECRET_BACKEND_PUBLISHER!,
    );
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };
    const emptyPayload = {};
    const response = await axios.post(
      process.env.PUBLISHER_API_URL + '/import/setup',
      emptyPayload,
      { headers },
    );
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
};
