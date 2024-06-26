import JWT from 'jsonwebtoken'

//function generateToken create token has 3 parameters: 
    // 1.userInfor: information attached with token
    // 2.secretSigNature: secret key 
    // 3.tokenLife: time to live of token

const generateToken = async (userInfor, secretSigNature, tokenLife) => {
  try {
    //
    return JWT.sign(userInfor, secretSigNature, {algorithm: 'HS256', expiresIn: tokenLife})
  } catch (error) {
    throw new Error(error)
  }
}


// function verify valid token, Dependent secretSignature
const verifyToken = async (token, secretSigNature) => {
  try {
    //
    return JWT.verify(token, secretSigNature)
  } catch (error) {
    throw new Error(error)
  }
}

export const ACCESS_TOKEN_SECRET_SIGNATURE = 'KBgJwUETt4HeVD05WaXXI9V3JnwCVP'
export const REFRESH_TOKEN_SECRET_SIGNATURE = 'fcCjhnpeopVn2Hg1jG75MUi62051yL'

export const JwtProvider = {
    generateToken,
    verifyToken
}
