import { BasePage } from "./basepage.js"

export class LoginPage extends BasePage
{

    constructor(page)
    {
        super(page)
        this.page=page
        this.usernameField=page.getByRole('textbox',{name:"Enter Email"})
        this.passwordField=page.getByRole('textbox',{name:"Enter Password"})
        this.loginButton=page.getByRole('button',{name:"Sign in"})
        this.errorMessage=page.locator(".errorMessage")
    }

    async loginToApplication(username,password)
    {
        await this.fill(this.usernameField,username)  // after using BasePage
        //await this.usernameField.fill(username) without BasePage
        
        await this.fill(this.passwordField,password) // after using BasePage
        //await this.passwordField.fill(password) without BasePage
        
        await this.click(this.loginButton)  // after using BasePage
        //await this.loginButton.click() without BasePage
    }

    async getErrorMessage()
    {
        return await this.errorMessage.textContent()
    }

}