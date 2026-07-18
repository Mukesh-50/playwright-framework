import {test,expect} from "../../fixture/fixture.js"

import { CategoryPage } from "../../pages/categorypage.js";

import { readExcel } from "../../utils/readexcel.js"

import courseData from "../../data/json/course.json"

const excelRows = readExcel("./data/excel/course.xlsx", "Course")

//object
const excelCourseData = 
{
    courseName: excelRows[0].courseName,

    thumbnailPath: excelRows[0].thumbnailPath,

    description: excelRows[0].description,

    instructorName: excelRows[0].instructorName,

    price: excelRows[0].price,

    category: excelRows[0].category,

    dates: 
    [
        { month: excelRows[0].date1Month, year: excelRows[0].date1Year, date: excelRows[0].date1Date },
        { month: excelRows[0].date2Month, year: excelRows[0].date2Year, date: excelRows[0].date2Date }
    ]
}


test.describe("Manage Course",()=>{

    test("Courses all actions test", async ({page,loggedInUser,dashboardPage,coursePage})=>
    {

        await dashboardPage.clickOnManageButton();

        await dashboardPage.clickOnManageCourse()

        await coursePage.clickOnAddNewCourse()

        await coursePage.enterCourseName(courseData.courseName)

        await coursePage.uploadFile(courseData.thumbnailPath)

        await coursePage.enterCourseDescription(courseData.description)

        await coursePage.enterTrainerName(courseData.instructorName)

        await coursePage.enterPrice(courseData.price)

        await coursePage.selectCurrentMonth()

        await coursePage.selectDates(courseData.dates[0].month,courseData.dates[0].year,courseData.dates[0].date)

        await coursePage.selectNextMonth()

        await coursePage.selectDates(courseData.dates[1].month,courseData.dates[1].year,courseData.dates[1].date)

        await coursePage.clickOnCategory(courseData.category)

        await coursePage.clickOnSave()

        await expect(coursePage.courseRow(courseData.courseName)).toBeVisible()

        await coursePage.clickOnDeleteButton(courseData.courseName)

        await expect(coursePage.courseRow(courseData.courseName)).not.toBeVisible()


    })

     test("Courses all actions test with excel", async ({page,loggedInUser,dashboardPage,coursePage})=>
    {

        await dashboardPage.clickOnManageButton();

        await dashboardPage.clickOnManageCourse()

        await coursePage.clickOnAddNewCourse()

        await coursePage.enterCourseName(excelCourseData.courseName)

        await coursePage.uploadFile(excelCourseData.thumbnailPath)

        await coursePage.enterCourseDescription(excelCourseData.description)

        await coursePage.enterTrainerName(excelCourseData.instructorName)

        await coursePage.enterPrice(excelCourseData.price)

        await coursePage.selectCurrentMonth()

        await coursePage.selectDates(excelCourseData.dates[0].month,excelCourseData.dates[0].year,excelCourseData.dates[0].date)

        await coursePage.selectNextMonth()

        await coursePage.selectDates(excelCourseData.dates[1].month,excelCourseData.dates[1].year,excelCourseData.dates[1].date)

        await coursePage.clickOnCategory(excelCourseData.category)

        await coursePage.clickOnSave()

        await expect(coursePage.courseRow(excelCourseData.courseName)).toBeVisible()

        await page.waitForTimeout(5000)

        await coursePage.clickOnDeleteButton(excelCourseData.courseName)

        await expect(coursePage.courseRow(excelCourseData.courseName)).not.toBeVisible()


    })


})
