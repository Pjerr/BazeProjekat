export interface UserLoginResponse{
    Status:boolean, //zbog ovog statusa on baguje u auth.service
    accessToken?:string,
    refreshToken?:string,
    email?:string,
    tipKorisnika?:string
}