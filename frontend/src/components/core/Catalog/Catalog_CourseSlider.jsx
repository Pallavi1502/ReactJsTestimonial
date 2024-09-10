import React from "react" 
// Import Swiper React components
import  {Swiper, SwiperSlide } from "swiper/react"
//import Swiper from "swiper"

// Import Swiper styles
import "swiper/css"
import "swiper/css/free-mode"
import 'swiper/css/pagination';
import "swiper/css/autoplay"
//import { FreeMode, Pagination } from "swiper"
import { FreeMode, Pagination, Autoplay } from 'swiper/modules';

// import { getAllCourses } from "../../services/operations/courseDetailsAPI"
import Course_Card from "./Catalog_CourseCard"

function Course_Slider({ Courses }) {
  return (
    <>
      {Courses?.length ? (
        <Swiper
          slidesPerView={1}
          spaceBetween={25}
          autoplay={{
            delay: 2000
          }}
          loop={true}
          modules={[FreeMode, Pagination, Autoplay]}
          breakpoints={{
            1024: {
              slidesPerView: 3,
            },
          }}
          className="max-h-[30rem]"
        >
          {Courses?.map((course, i) => (
            <SwiperSlide key={i}>
              <Course_Card course={course} Height={"h-[250px]"} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p className="text-xl text-richblack-5">No Course Found</p>
      )}
    </>
  )
}

export default Course_Slider
