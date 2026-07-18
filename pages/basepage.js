export class BasePage
{
    // keep all actions which is used again n again

    constructor(page)
    {
       this.page=page 
    }

    async goto(path)
    {
        await this.page.goto(path)
    }

    async click(locator)
    {
        await locator.click()
    }

    async fill(locator,value)
    {
        await locator.fill(value)
    }x

    async selectOptions(locator,value)
    {
        await locator.selectOptions(value)
    }

    async uploadFile(locator,filePath)
    {
        await locator.setInputFiles(filePath)
    }

    async acceptDialogAndClick(locator,textToEnter)
    {
        this.page.once("dialog",async dialog=>{

            await dialog.accept(textToEnter)

        })

        await this.click(locator)
    }


    async clickAndWaitForNewPage(locator)
    {

        const [newPage]=await Promise.all(

            [
               this.page.context().waitForEvent("page") , // or popup

               this.click(locator)
            ]
        )

        return newPage
      
    }



















    


}