//import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VerificationEmail";
import nodemailer from "nodemailer"
import {render} from '@react-email/components'

import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email:string,
    username:string,
    verifyCode:string,
    baseUrl:string,
): Promise<ApiResponse>{
    try {
        // //Resend and React-email to send mails
        // await resend.emails.send({
        //     from: 'onboarding@resend.dev',
        //     to: email,
        //     subject: 'Verification code',
        //     react: VerificationEmail({ username, otp:verifyCode , baseUrl }),
        // });

        //Nodemailer to send mails
        const transporter = nodemailer.createTransport({
            service: "Gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
              user: process.env.GMAIL_APP_USER,
              pass: process.env.GMAIL_APP_PASS,
            },
          });
        const emailHtml=await render(VerificationEmail({username,otp:verifyCode,baseUrl}))
        const mailOptions ={
            from:"commentary@gmail.com",
            to:email,
            subject:"Verification Code",
            html:emailHtml
        }
        await transporter.sendMail(mailOptions)
        return{success:true, message:'verification email sent'}
      
    } catch (error) {
        console.error('Error sending verification email',error);
        return {success:false, message:'Failed to send verification email'}
    }
}