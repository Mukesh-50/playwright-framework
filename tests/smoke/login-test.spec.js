import {test,expect} from "../../fixture/fixture.js"
import data from "../../data/json/validcredentials.json"
import dataset from "../../data/json/invalidcredentials.json"

test.describe("Login Test Scenarios",()=>{

    test("Login with valid credentials", async ({page,loginPage,dashboardPage})=>
    {
        await page.goto("/login")

        await loginPage.loginToApplication(data.username,data.password)

        await expect(page).not.toHaveURL("/login")

        await dashboardPage.logoutFromApplication()

        await expect(page).toHaveURL("/login")   
        

    })

    for(let i=0;i<dataset.length;i++)
    {

    test(`Login with different dataset ${dataset[i].id}`, async ({page,loginPage})=>
    {
        await page.goto("/login")

        await loginPage.loginToApplication(dataset[i].username,dataset[i].password)

        await expect(await loginPage.getErrorMessage()).toBe(dataset[i].message)

    })

    }


    

})
