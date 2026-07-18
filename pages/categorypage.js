import { BasePage } from "./basepage.js";


// if some locators are parametized then dont keep inside constructor

export class CategoryPage extends BasePage
{

    constructor(page)
    {
        super(page)

        this.page=page

        this.addNewCategory=page.getByRole("button",{name:"Add New Category "})

        this.deleteCategory=page.locator("//div[text()='Delete Category']//following::button[text()='Delete']")

    }

    async clickOnAddNewCategory(categoryName)
    {
        await this.acceptDialogAndClick(this.addNewCategory,categoryName)
    }

    async categoryInTable(categoryName)
    {
        return this.page.locator(`//td[text()='${categoryName}']`)
    }

    async clickOnUpdateCategory(oldCategoryName,newCategoryName)
    {
        const updateButton=this.page.locator(`//td[text()='${oldCategoryName}']//following::button[normalize-space()='Update'][1]`)

        await this.acceptDialogAndClick(updateButton,newCategoryName)   
        
    }

    async clickOnDeleteCategory(categoryName)
    {
        const deleteButton=this.page.locator(`//td[text()='${categoryName}']//following::button[normalize-space()='Delete'][1]`)

        this.click(deleteButton)

        this.click(this.deleteCategory)
    }   



}