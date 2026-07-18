import { BasePage } from "./basepage.js"

export class DashBoardPage extends BasePage
{

    constructor(page)
    {
        super(page)
        this.page=page
        this.menuIcon=page.getByRole('img',{name:"menu"})
        this.signOut=page.getByRole("button",{name:"Sign out"})
        this.manageIcon=page.getByText('Manage', { exact: true })
        this.manageCategory=page.getByRole('link', { name: 'Manage Categories' })
        this.manageCourses=page.getByRole('link', { name: 'Manage Courses' })
   


    }

   
    async logoutFromApplication()
    {
        await this.click(this.menuIcon)
        //await this.menuIcon.click()
        
        await this.click(this.signOut)
        //await this.signOut.click()
    }  
    
    async clickOnManageCourse()
    {
        await this.click(this.manageCourses)
    }


    async clickOnManageButton()
    {
        await this.click(this.manageIcon)
    }
    
    async clickOnManageCategory()
    {
        const newPage = await this.clickAndWaitForNewPage(this.manageCategory)

        return newPage;

    }

}