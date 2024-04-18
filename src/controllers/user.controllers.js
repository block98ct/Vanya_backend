import User from "../modals/user.modals.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { Op } from "sequelize";



export const options = {
  httpOnly: true,
  secure: true,
};


export const generateAccessAndRefreshToken = async (userId) => {
  try {
    // Assuming you have the User model imported
    const user = await User.findByPk(userId);

    if (!user) {
      throw new Error("User not found");
      
    }

    // Generate refresh token
    // const refreshToken = await user.generateRefreshToken();

    // Generate access token
    const accessToken = await user.generateAccessToken();
   // await user.update({ refreshToken });

    return {  accessToken };
  } catch (error) {
    console.error("Error generating tokens:", error);
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};









export const userRegisterHandle = async (req, res) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (
      [username, email, password, confirmPassword].some(
        (field) => field?.trim() === ""
      )
    ) {
     //throw new ApiError(400, "All fields are required");
     return res
     .status(201)
     .json(new ApiResponse(200, {}, "All fields are required", false));
    }
      

    if (password !== confirmPassword) {

      // throw new ApiError(400, "Passwords do not match");
      return res
     .status(201)
     .json(new ApiResponse(200, {}, "Passwords do not match", false));

    }

    const exitedUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (exitedUser) {
    //  throw new ApiError(409, "User with email or username already exists");
      return res
      .status(201)
      .json(new ApiResponse(200, {}, "User with email or username already exists", false));
 
      
    }

    const newUser = await User.create({
      username,
      email,
      password,
      
    });
    if (!newUser) {
      // throw new ApiError(
      //   409,
      //   "something went wrong while registering new user"
      // );

      return res
      .status(401)
      .json(new ApiResponse(400, {}, "something went wrong while registering new user", false));
 
    }

    return res
      .status(201)
      .json(new ApiResponse(200, newUser, "user registered successfully"));
  } catch (error) {
    console.log(`error while registering user ${error}`);
    res.status(200).json({
      sucess: false,
      message: "user not registerd ",
      error: error,
    });
  }
};












export const userLoginHandle = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
    // throw new ApiError(400, "All fields are required");
      return res

      .status(201)
      .json(new ApiResponse(200, {}, "All fields are required", false));
    }

    const user = await User.findOne({
      where: {
        email,
      },
    });

    if (!user) {
      //throw new ApiError(409, "user does not exits");
      return res
      .status(201)
      .json(new ApiResponse(200, {}, "user does not exits", false));
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
    //  throw new ApiError(401, "Invalid user credentials");

      return res
      .status(201)
      .json(new ApiResponse(200, {}, "Invalid user credentials", false));
    }

    const loggedInUser = await User.findByPk(user.id, {
      attributes: { exclude: ["password", "confirmPassword", "refreshToken"] },
    });

    const { accessToken } = await generateAccessAndRefreshToken(
      user.id
    );

    res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .json(
        new ApiResponse(
          200,
          { user: loggedInUser, accessToken },
          "user logged in successfully"
        )
      );
  } catch (error) {
    console.log(`error while login user ${error}`);
    res.status(200).json({
      sucess: false,
      message: "user not login ",
    });
  }
};








export const userLogoutHandle = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id)
   // await user.update({ refreshToken: null });

    res
      .status(201)
      .clearCookie("accessToken", options)
      .json(new ApiResponse(200, {}, "user loggout successfully"));
  } catch (error) {
    console.log(`error while log out user ${error}`);
    res.status(500).json(new ApiResponse(500, {}, "Internal server error", false));
  }
};







export const  updateUserPasswordHandle= async(req, res)=>{
  try {
    const {oldPassword, newPassword, confirmPassword} = req.body
    if (!oldPassword || !newPassword || !confirmPassword) {
       throw new ApiError(409, "All fields are required")
      
    }
    const user =await User.findByPk(req.user?.id)

    if (!user) {
       throw new ApiError(401, "user does not exits")
      
    }

    if ( newPassword !== confirmPassword) {
        throw new ApiError(401, "Password should be the same")
      
    }
     
    const isPasswordCorrect = await user.comparePassword(oldPassword)
    if (!isPasswordCorrect) {
      throw new ApiError(401, "old password did not match")
      
    }
    
    await user.update({password: newPassword}) 

    

    res
    .status(201)
    .json(new ApiResponse(200, {}, "password updated successfully"));
   

  

  } catch (error) {
    res.status(200).json({
      sucess: false,
      message: "user password not updated",
    });
    console.log(error)
    
  }

}






