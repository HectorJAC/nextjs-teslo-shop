import { jwt } from "../../utils";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";

export async function middleware(req:any, ev:NextFetchEvent) {
    const { token = '' } = req.cookies;

    try {
        await jwt.isValidToken(token);
        return NextResponse.next();
    } catch (error) {
        const requestPage = req.page.name;
        return NextResponse.redirect(`/auth/login?p=${requestPage}`);
    }
};
