import {test,expect} from "../../fixture/fixture.js"
import { CategoryPage } from "../../pages/categorypage.js";

test.describe("Manage Category - Create Edit Delete Category",()=>{

    test("Category all actions test", async ({page,loggedInUser,dashboardPage})=>
    {
        //flow - run the test > fixture will be loaded as Hooks browser, context , page , loggedInUser , dashboardPage

        // now we are doing steps
       
        await dashboardPage.clickOnManageButton();

        const newPage=await dashboardPage.clickOnManageCategory()

        const categoryPage=new CategoryPage(newPage)

        await categoryPage.clickOnAddNewCategory("GenAI") // add new category

        // assertions
        await expect(await categoryPage.categoryInTable("GenAI")).toBeVisible() // assertion 

        // update the category 

        await categoryPage.clickOnUpdateCategory("GenAI","AgenticAI")

        await expect(await categoryPage.categoryInTable("AgenticAI")).toBeVisible()

        await categoryPage.clickOnDeleteCategory("AgenticAI")

        await expect(await categoryPage.categoryInTable("AgenticAI")).not.toBeVisible()

        await categoryPage.page.close() // optional

        await page.bringToFront() //optional

    })

    test("Kavya", async ({page})=>
    {
        
        const actual=["Selenium","Playwright","Cypress"] // this is coming from your pages 

        const expected=["Selenium","Playwright","Cypress","WDIO"] // this will come from testcases

        //expect(actual).toEqual(expected)

        expect(actual).toContain("Playwright")
    })

})
