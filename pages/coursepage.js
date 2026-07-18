import { BasePage } from "./basepage.js";

export class CoursePage extends BasePage
{

    constructor(page)
    {
        super(page)
        this.page=page
        this.addNewCourse=page.getByRole('button', { name: 'Add New Course' })
        this.thumbnailInput=page.locator('#thumbnail')
        this.courseName=page.locator('#name')
        this.description=page.locator('#description')
        this.instructorName=page.locator('#instructorNameId')
        this.price=page.locator('#price')
        this.startDate=page.locator('[name="startDate"]')
        this.endDate=page.locator('[name="endDate"]')
        this.currentMonthYear=page.locator("//div[@class='react-datepicker__current-month']")
        this.nextMonth=page.getByRole('button', { name: 'Next Month' })
        this.allDates=page.locator("//div[contains(@class,'month-container')]//div[contains(@class,'datepicker__day')]")
        this.selectCategory=page.getByText('Select Category', { exact: true })
        this.saveButton=page.getByRole('button', { name: 'Save' })
    }

     async uploadFile(filePath)
    {
        await super.uploadFile(this.thumbnailInput,filePath)
    }

    async enterCourseName(name)
    {
        await this.fill(this.courseName,name)
    }

    async clickOnAddNewCourse()
    {
        await this.click(this.addNewCourse)
    }

    async enterCourseDescription(name)
    {
        await this.fill(this.description,name)
    }

     async enterTrainerName(name)
    {
        await this.fill(this.instructorName,name)
    }

     async enterPrice(price)
    {
        await this.fill(this.price,price)
    }


    async selectCurrentMonth()
    {
        await this.click(this.startDate)
    }

     async selectNextMonth()
    {
        await this.click(this.endDate)
    }


    async selectDates(month,year,date)
    {
        const targetMonthYear=`${month} ${year}`

        let attempts=0
  
        while(await this.currentMonthYear.textContent()!== targetMonthYear)
        {
            attempts++

            if(attempts>24)
            {
                throw new Error(`Could not find month/year "${targetMonthYear}" in datepicker after ${attempts} attempts`)
            }

            await this.click(this.nextMonth)
        }

        const dates=await this.allDates.all()

        for(const dayLocator of dates)
        {
            const dayText=(await dayLocator.textContent()).trim()

            if(dayText === `${date}`)
            {
                await this.click(dayLocator)
                break
            }
        }
    }

    async clickOnCategory(categoryName)
    {
        await this.click(this.selectCategory);
        await this.click(this.page.getByRole('button', { name: categoryName }))
    }

    async clickOnSave()
    {
        await this.click(this.saveButton)
    }

    async clickOnDeleteButton(courseName)
    {
        await this.click(this.page.locator(`//td[text()='${courseName}']//following::button[1]`))
    }

    courseRow(courseName)
    {
        return this.page.locator(`//td[text()='${courseName}']`)
    }

}