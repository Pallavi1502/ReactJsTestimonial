
const Course = require("../models/Course")

const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const { courseEnrollmentEmail,} = require("../mail/templates/courseEnrollmentEmail")
const CourseProgress = require("../models/CourseProgress")
const dotenv = require("dotenv");


// total amount
exports.getTotalAmount = async (req, res) => {

  const  {courses, uid} = req.body
  // const uid = req.user.id
  
    if (courses.length ===0)
    {
      return res.json({ success: false, message: "Please Provide Course ID" })
    }
  let total_amount = 0

  try{

    //try{
      for (const courseid of courses) {
      let course

    
      // Find the course by its ID
      course = await Course.findById(courseid)

      // If the course is not found, return an error
      if (!course) {
        return res
          .status(200)
          .json({ success: false, message: "Could not find the Course" })
      }

      // Check if the user is already enrolled in the course
      console.log("checking if user already enrolled,uid", uid)
      
      if (course.studentsEnrolled.includes(uid)) {
        return res
          .status(200)
          .json({ success: false, message: "Student is already Enrolled" })
      }

      // Add the price of the course to the total amount
      total_amount += course.price
    }
    
    return res.json({success:true, data:total_amount, message:"calc total amt success"})
  }
    catch(error){
      console.log(error)
      return res.status(500).json({ success: false, message: error.message })
    }
}



// enroll the student in the courses

exports.enrollStudents =  async (req,  res) => {
    
    console.log("req.body  in enrollStudent:  ", req.body)
    const uid = req.body.uid
    const allCourses = req.body.courses
    
    if (!allCourses || !uid) {
      return res.status(400).json({ success: false, message: "Please Provide Course ID and User ID" })
    }

    const user = await User.findById(uid)
    console.log("USER OBJ in enrollStudents is: ", user)

  for (const c of allCourses){
  //  if(c?.studentsEnrolled.includes(userId)){
  if(user.courses.includes(c)){
    return res
      .status(400)
      .json({ success: false, message: "user already enrolled" })
  }
  } 

  for (const courseId of allCourses) {
    try {
      // Find the course and enroll the student in it
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: uid } },
        { new: true }
      )

      if (!enrolledCourse) {
        return res
          .status(500)
          .json({ success: false, error: "Course not found" })
      }
      console.log("Updated course: ", enrolledCourse)

      const courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId: uid,
        completedVideos: [],
      })
      // Find the student and add the course to their list of enrolled courses
      const enrolledStudent = await User.findByIdAndUpdate(
        uid,
        {
          $push: {
            courses: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true }
      )

      console.log("Enrolled student completed, enrolledStudent is: ", enrolledStudent)
               // Send an email notification to the enrolled student
      const emailResponse = await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
       )
      )

      console.log("Email sent successfully: ", emailResponse.response)
      return res.json({ success: true, message:"Student enrolled successfully , not enrolled n sent email" })

    } catch (error) {
      console.log(error)
      return res.status(400).json({ success: false, error: error.message })
    }
  }
}



