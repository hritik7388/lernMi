// src/common/middleware/notFound.middleware.ts
import { Request, Response } from "express";

export const notFoundMiddleware = (
    req:Request,
    res:Response
)=>{

return res.status(404).json({

success:false,

statusCode:404,

message:"Route not found"

})

}