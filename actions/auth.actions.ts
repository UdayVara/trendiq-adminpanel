"use server"

import { auth, signIn } from "@/auth"


type SigninSchemaType = {
    email:string,
    password:string
}

export const signInAdmin = async(data:SigninSchemaType) => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const res = await signIn("credentials",{email:data.email,password:data.password,redirect:false})
        return {
            success: true,message:"User Signed In"}
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
        console.log(error,"error")
        return {
            success: false,
            message:error?.cause?.err?.message || "Invalid Credentials"
        }
    }
}

export const getUser = async() => {
    return await auth();
}