const usermodel = require('../Models/userModel');
const jwt=require('jsonwebtoken');
// const {sendEmail}=require('../nodemailer')
require('dotenv').config
const sendEmail=require('../emailsend')

exports.signup = async (req, res) => {
  try {
    const { name, age, gender, phone, email } = req.body;

    if (!name || !age || !gender || !phone || !email) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const existingUser = await usermodel.findOne({
      $or: [{ email }, { phone }]
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists"
      });
    }

    const user = await usermodel.create({
      name,
      age,
      gender,
      phone,
      email
    });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error during signup"
    });
  }
};

exports.loginWithOtp = async (req, res) => {
  try {
    const { email } = req.body;
    console.log("loginemail",email);

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required!"
      });
    }

    const user = await usermodel.findOne({ email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    const expiryTime = new Date(Date.now() + 5 * 60 * 1000);

    await usermodel.findByIdAndUpdate(
      user._id,
      {
        otp: {
          currentOtp: otp,
          timeDuration: expiryTime
        }
      },
      { new: true }
    );

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "10m" }
    );

    const subject = "Your OTP for Login - Orufy";
    const textmsg = `Your OTP is ${otp}. It is valid for 5 minutes.`;

    const htmlpage = `
      <div style="font-family: Inter, Arial, sans-serif; background:#f4f6f8; padding:30px">
        <div style="max-width:500px; margin:auto; background:#ffffff; padding:30px; border-radius:8px">
          <h2 style="color:#111827">Login Verification</h2>
          <p style="color:#374151">
            Use the OTP below to login to your Orufy account
          </p>

          <div style="text-align:center; margin:25px 0">
            <span style="font-size:32px; letter-spacing:6px; font-weight:700; color:#2563eb">
              ${otp}
            </span>
          </div>

          <p style="font-size:14px; color:#6b7280">
            OTP is valid for <strong>5 minutes</strong>.
          </p>

          <hr style="margin:25px 0" />
          <p style="font-size:12px; color:#9ca3af">
            © ${new Date().getFullYear()} Orufy
          </p>
        </div>
      </div>
    `;

    await sendEmail(email, subject, textmsg, htmlpage);

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      token 
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error while login with OTP"
    });
  }
};


exports.resendOtp = async (req, res) => {
  try {
   const userid=req.userDetail?._id;
   console.log(userid);
   if(!userid){
    return res.status(400).json({message:"session timeOut back to login and retry!"})
   }

   const user=await usermodel.findById(userid);
  if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }
const email=user.email;
console.log("userEmail",email);

    const otp = Math.floor(100000 + Math.random() * 900000);

    const expiryTime = new Date(Date.now() + 5 * 60 * 1000);

    await usermodel.updateOne(
      { _id: user._id },
      {
        otp: {
          currentOtp: otp,
          timeDuration: expiryTime
        }
      }
    );

    const subject = "Your New OTP - Orufy";
    const textmsg = `Your new OTP is ${otp}. Valid for 5 minutes.`;

    const htmlpage = `
      <div style="font-family: Inter, Arial, sans-serif; background:#f4f6f8; padding:30px">
        <div style="max-width:500px; margin:auto; background:#ffffff; padding:30px; border-radius:8px">
          <h2 style="color:#111827">Resend OTP</h2>
          <p>Your new OTP for login is</p>

          <div style="text-align:center; margin:25px 0">
            <span style="font-size:32px; letter-spacing:6px; font-weight:700; color:#2563eb">
              ${otp}
            </span>
          </div>

          <p style="font-size:14px; color:#6b7280">
            OTP valid for 5 minutes.
          </p>
        </div>
      </div>
    `;
    await sendEmail(email, subject, textmsg, htmlpage);
    return res.status(200).json({
      success: true,
      message: "OTP resent successfully"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error while resending OTP"
    });
  }
};


exports.verifyOtp = async (req, res) => {
  try {
    const { otp } = req.body.otp;
    console.log("otp",otp);

    if (!otp) {
      return res.status(400).json({ success: false, message: "OTP is required" });
    }

    const userId = req.userDetail?._id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: No user info" });
    }

    const user = await usermodel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (!user.otp || user.otp.currentOtp !== Number(otp)) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    if (new Date() > new Date(user.otp.timeDuration)) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    const finalToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    user.otp = { currentOtp: 0, timeDuration: null };
    await user.save();

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      token: finalToken
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server error while verifying OTP"
    });
  }
};
