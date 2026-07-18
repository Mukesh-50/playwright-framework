import{test as base,expect} from "@playwright/test"

import { LoginPage } from "../pages/loginpage.js"

import {DashBoardPage} from "../pages/dashboardpage.js"

import {CoursePage} from "../pages/coursepage.js";

const test=base.extend({

            loginPage:async ({page},use)=>
            {
                const loginPage=new LoginPage(page)

                await use(loginPage)

            }
            ,

             loggedInUser:async ({page},use)=>
            {
                const loginPage=new LoginPage(page)

                await loginPage.goto("/login")

                await loginPage.loginToApplication("admin@email.com","admin@123") // this has to come from config or env file or json file

                await use(loginPage)

                const dashboardPage=new DashBoardPage(page)

                await dashboardPage.logoutFromApplication()

            },

              loggedInOnce:async ({page},use)=>
            {
                const loginPage=new LoginPage(page)

                await loginPage.goto("/login")

                await loginPage.loginToApplication("admin@email.com","admin@123") // this has to come from config or env file or json file

                await use(loginPage)

            }
            ,

            dashboardPage: async ({page},use)=>{

                const dashboardPage=new DashBoardPage(page)

                await use(dashboardPage)

            },

            registrationPage: async ({page},use)=>{

                const registrationPage=new RegistrationPage(page)

                await use(registrationPage)

            },

            coursePage: async ({page},use)=>{

                const coursePage=new CoursePage(page)

                await use(coursePage)

            }


})

export {test,expect}