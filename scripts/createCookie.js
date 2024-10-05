const User = require('../dist/features/user/userModel').default;
const cookieSignature = require('cookie-signature');
require('dotenv').config({ path: '.env.local' });
const { connectDB, closeDB } = require('../dist/config/db');

async function getCookie() {
  try {
    await connectDB();
    const user = await User.findOne({ providerId: 'dummyId' }); // Create a mock user
    if (!user) {
      console.error('User not found');
      return;
    }
    const signedCookie = `s:${cookieSignature.sign(user.accessToken, process.env.COOKIE_SECRET)}`;
    console.log(`endchess-token=${signedCookie}`);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await closeDB();
  }
}

getCookie();
