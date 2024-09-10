import { toast } from "react-hot-toast"

import { resetCart } from "../../Slices/cartSlice"
import { apiConnector } from "../apiConnector"
import { studentEndpoints } from "../apis"


const {
  GET_TOTAL_AMOUNT,
  ENROLL_STUDENTS
} = studentEndpoints

// Buy the Course
export async function BuyCourse(
  token,
  courses,
  user_details,
  navigate,
  dispatch
) {

  const uid = user_details._id

  const toastId = toast.loading("Loading...")
  try {

    const total_amt  = await apiConnector(
      "POST", 
      GET_TOTAL_AMOUNT,
      {courses, uid},
      {
        Authorization:`Bearer ${token}`,
      }
    )
    if (!total_amt.data) {
      throw new Error("Could Not Fetch total amt")
    }
    const amount=total_amt.data.data
    console.log("PAYMENT total RESPONSE FROM BACKEND............", total_amt, total_amt.data)


    const enrolled =await apiConnector(
      "POST",
      ENROLL_STUDENTS,
      {courses,uid },
      {
        Authorization:`Bearer ${token}`,
      }
    )

    console.log("ENROLLED student successully")

    toast.success("payment complete")

    navigate("/dashboard/enrolled-courses", { replace: true })
    dispatch(resetCart())
  } catch (error) {
    console.log("PAYMENT API ERROR............", error)
    toast.error("Could Not make Payment.")
  }
  toast.dismiss(toastId)
}










