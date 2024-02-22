const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");


//send OTP
exports.sendOTP = async (req,res) => {
    try{
        //fetch email
        const {email} = req.body;

        //user exists or not
        const checkUserPresent = await User.findOne({email});

        //user exists
        if(checkUserPresent) {
            return res.status(401).json({
                success:false,
                message:'User already exists',
            })
        }

        //generate otp
        var otp = otpGenerator.generate(6,{
            upperCaseAlphabets:false,
            lowerCaseAlphabets:false,
            specialChars:false,
        });
        console.log("OTP generated: ", otp);

        //check for unique otp
        let result = await OTP.findOne({otp: otp});
        while(result){
            otp = otpGenerator.generate(6,{
                upperCaseAlphabets:false,
                lowerCaseAlphabets:false,
                specialChars:false,
            });
            result = await OTP.findOne({otp: otp});
        }

        const otpPayload = {email, otp};

        //create entry  for otp
        const otpBody = await OTP.create(otpPayload);
        console.log(otpBody);

        res.status(200).json({
            success:true,
            message:'OTP sent successfully',
            otp,
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }

}

//SignUp
exports.signUp = async (re,res) =>{
    try{
            //fetch data
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            accountType,
            contactNumber,
            otp,
        } = req.body;
        //validation
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp ){
            return res.status(403).json({
                success: false,
                message:" All fields are requird",
            });
        }

        //2 pwds match
        if(password !== confirmPassword){
            return res.status(400).json({
                success: false,
                message:"Password and Confirm password doesnt match",
            });
        }

        // check user already exists 
        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).json({
                success:false,
                message:'User already registered',
            });
        }

        //find most recent otp in db
        const recentOTP = await OTP.find({email}).sort({createdAt:-1}).limit(1);
        console.log("recent otp", recentOTP);

        //validate otp
        if(recentOTP.length == 0){
            //otp not found
            return res.status(400).json({
                success:false,
                message:"otp not found"
            })
        }else if(otp !== recentOTP){
            //invalid otp
            return res.status(400).json({
                success:false,
                message:"Invalid OTP",
            });
        }


        // hash password
        const hashedPassword = await bcrypt.hash(password,10);

        const profileDetails = await Proile.create({
            gender:null,
            dateOfBirth:null,
            about:null,
            contactNumber:null
        });
        const user = await User.create({
            firstName,
            lastName,
            email,
            password:hashedPassword,
            accountType,
            contactNumber,
            additionalDetails:profileDetails._id,
            image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
        })

        return res.status(200).json({
            success:true,
            message:"User registered successfully",
            user,
        });

    }catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"User cannot be registered"
        })
    }
}