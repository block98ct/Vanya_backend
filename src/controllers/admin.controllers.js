import { ApiResponse } from "../utils/ApiResponse.js";
import User from "../modals/user.modals.js";
import contractAddress from "../modals/contractAddress.modal.js";
import Admin from "../modals/admin.modal.js";
import { ApiError } from "../utils/ApiError.js";
import { Op } from "sequelize";
import bcrypt from "bcryptjs";
import { options } from "./user.controllers.js";

// ******************* GET ALL USERS ******************
export const getAllUsersHandle = async (req, res) => {
  try {
    const allUser = await User.findAll({
      attributes: ["username", "email"],
    });

    res.status(201).json(new ApiResponse(200, allUser, "all user list"));
  } catch (error) {
    console.log(error);

    res.status(201).json({
      success: false,
      data: error,
    });
  }
};

// *********************** ADMIN REGISTER **************************
export const adminRegisterHandle = async (req, res) => {
  try {
    let { username, email, password } = req.body;

    if ([username, email, password].some((field) => field?.trim() === "")) {
      throw new ApiError(400, "All fields are required");
    }

    const hashPassword = await bcrypt.hash(password, 10);
    password = hashPassword;

    const exitedUser = await Admin.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (exitedUser) {
      throw new ApiError(409, "User with email or username already exists");
    }

    const newUser = await Admin.create({
      username,
      email,
      password,
    });

    if (!newUser) {
      throw new ApiError(
        409,
        "something went wrong while registering new user"
      );
    }

    return res
      .status(201)
      .json(new ApiResponse(200, newUser, "Admin  registered successfully"));
  } catch (error) {
    console.log(`error while registering admin ${error}`);
    res.status(200).json({
      sucess: false,
      message: "admin not registerd ",
      error: error,
    });
  }
};

// ****************** ADMIN LOGIN *****************
export const adminLoginHandle = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "All fields are required");
    }

    const admin = await Admin.findOne({
      where: {
        email,
      },
    });

    if (!admin) {
      throw new ApiError(409, "you are not authorized user");
    }

    const comparePassword = await bcrypt.compare(password, admin.password);

    if (!comparePassword) {
      throw new ApiError(401, "Invalid user credentials");
    }

    const accessToken = await admin.generateRefreshToken();
    console.log(accessToken);

    const loggedInUser = await Admin.findByPk(admin.id, {
      attributes: { exclude: ["password"] },
    });

    res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .json(
        new ApiResponse(
          200,
          {
            user: loggedInUser,
            accessToken,
          },
          "user logged in successfully",
          true
        )
      );
  } catch (error) {
    console.log(error);
    res.status(200).json({
      sucess: false,
      message: "admin not login",
      error: error,
    });
  }
};

//******************* ADMIN LOGOUT********************
export const adminLogoutHandle = async (req, res) => {
  try {
    const admin = Admin.findByPk(req.user?.id);

    res
      .status(201)
      .clearCookie("accessToken", options)
      .json(new ApiResponse(200, {}, "Admin logout successfully"));
  } catch (error) {
    console.log(`error while log out admin ${error}`);
    res.status(500).json(new ApiResponse(500, {}, "Internal server error"));
  }
};

//******************* USER DATA SEARCH ********************

export const userDataSearchHandle = async (req, res) => {
  try {
    const { value } = req.query;

    const user = await User.findAll({
      where: {
        [Op.or]: [
          { id: { [Op.like]: `%${value}%` } },
          { username: { [Op.like]: `%${value}%` } },
          { email: { [Op.like]: `%${value}%` } },
        ],
      },

      attributes: {
        exclude: ["password", "refreshToken"],
      },
    });

    if (!user) {
      throw new ApiError(401, "Invalid Search");
    }

    res.status(200).json(
      new ApiResponse(200, {
        success: true,
        data: user,
      })
    );
  } catch (error) {
    console.error("Error searching users:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

//******************* DELETE USER DATA  ********************

export const deleteUserHandle = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      throw new ApiError(401, "Invalid user");
    }

    await user.destroy();

    res
      .status(201)
      .json(
        new ApiResponse(200, {
          sucess: true,
          message: "user deleted successfully",
        })
      );
  } catch (error) {
    console.log(error);
    res.status(200).json({
      success: false,
      message: `error while deleting user ${error}`,
    });
  }
};

export const getAllAddressWithOwner = async (req, res) => {
  try {
    const allAddress = await contractAddress.findAll({
      attributes: ["owner", "address"],
    });

    if (!allAddress) {
      new ApiError(401, "there is no contract address");
    }

    res.status(201).json(new ApiResponse(200, allAddress, "all address list"));
  } catch (error) {
    console.log(error);
    res.status(200).json({
      success: false,
      message: `error while getting address with owner ${error}`,
    });
  }
};
