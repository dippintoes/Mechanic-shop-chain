export const AUTH_RESPONSES = {

    INVALID_CREDENTIALS : {
        statusCode : 400,
        message :"Invalid Credentials"
    },

    VALID_CREDENTIALS : {
        statusCode : 500,
        message :"Valid Credentials"
    },
    ALREADY_REGISTERED : {
        statusCode : 409,
        message : "User already registered"
    },

    ACCESS_DENIED : {
        statusCode : 403,
        message :"Access Denied"
    },

   
}