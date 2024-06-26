import { StatusCodes } from 'http-status-codes';
import {
  JwtProvider,
  ACCESS_TOKEN_SECRET_SIGNATURE,
  REFRESH_TOKEN_SECRET_SIGNATURE,
} from '~/providers/JwtProvider';

//middleware will undertake important task: get and auhthenticate token received from fe
const isAuthorized = async (req, res, next) => {
  //Method 1: get from request cookies-withCredentials
  const accessTokenFromCookie = req.cookies?.accessToken;
  
  if (!accessTokenFromCookie) {
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'unauthorized! (Token not found)' });
    return 
  }

  //method 2: get from local storage, which fe sent
  // const accessTokenFromHeader = req.headers?.authorization;
  // console.log('accessTokenFromHeader ', accessTokenFromHeader);
  // if (!accessTokenFromHeader) {
  //   res
  //     .status(StatusCodes.UNAUTHORIZED)
  //     .json({ message: 'unauthorized! (Token not found)' });
  //   return 
  // }

  try {
    //step 1: Decrypt token
    const accessTokenDecoded = await JwtProvider.verifyToken(
      accessTokenFromCookie,
      // accessTokenFromHeader,
      ACCESS_TOKEN_SECRET_SIGNATURE
    );
    //step 2: if token is valid, save token which was decrypted into the req.jwtDecode to use
    req.jwtDecoded = accessTokenDecoded;

    console.log('accessTokenDecoded ', accessTokenDecoded)

    next()

    //step 3: allow request continue
  } catch (error) {
    console.log('error from middleware ', error);

    // case 1: if access token expired, return error 410 code
    if (error.message?.includes('jwt expired')) {
      res
        .status(StatusCodes.GONE)
        .json({ message: 'Need to refresh token' })
      return
    }

    // case 2: if access token is invalid, different from error code, return 401 error
    res
      .status(StatusCodes.UNAUTHORIZED)
      .json({ message: 'unauthorized! Please login' });
  }
};

export const authMiddleware = {
  isAuthorized,
};
