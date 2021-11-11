import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import {ApiConfig} from "../config/api.config";

export default function api(
    path: string,
    method: 'get' | 'post' | 'patch' | 'delete',
    body: any | undefined
){
    return new Promise<ApiResponse>((resolve)=>{
        const requestData={
            method: method,
            url: path,
            baseURL:ApiConfig.API_URL,
            data: JSON.stringify(body),
            headers:{
                'Content-Type':'application/json',
                'Authorization': getToken(),
            },
        };
        axios(requestData)
            .then(res=>responseHandler(res, resolve))
            .catch(async err=>{
                if (err.response.status === 401) {//ukuliko nemamo validan token
                    const newToken = await refreshToken();

                    if(!newToken){
                        const response: ApiResponse = {
                            status: 'login',
                            data: null
                        }
                        return resolve(response);
                    }

                    saveToken(newToken);

                    requestData.headers["Authorization"]=getToken();

                    return await repeatRequest(requestData, resolve);
                }

                const response: ApiResponse={
                    status: 'error',
                    data:err
                };
                resolve(response);
            });
    });
}

export interface ApiResponse{
    status:'ok' | 'error' | 'login';
    data: any;

}

async function responseHandler(
    res: AxiosResponse<any>,
    resolve: (value: ApiResponse) => void) {
    if (res.status < 200 || res.status >= 300) {//provera da li je greska na serveru



        const response: ApiResponse = {
            status: 'error',
            data: res.data
        }
        return resolve(response);
    }

    let response: ApiResponse;

    if (res.data.statusCode < 0) {//provera da li je greska npr pogresan pasword, kada se vraca ApiResponse
       response = {
            status: 'login',
            data: null
        };
    }else {
        response={
            status: 'ok',
            data: res.data,
        };
    }

    resolve(response);
}

function getToken():string {
    const token=localStorage.getItem('api_token')
    return "Bearer " + token;
}

export function saveToken(token: string) {
    localStorage.setItem('api_token', token)
}

function getRefreshToken():string {
    const token=localStorage.getItem('api_refresh_token');
    return token+ '';
}

export function saveRefreshToken(token: string) {
    localStorage.setItem('api_refresh_token', token)
}

async function refreshToken(): Promise<string | null> {
    const path='auth/user/refresh';
    const data={
        token: getRefreshToken()
    }

    const refreshTokenRequestData: AxiosRequestConfig={
        method: 'post',
        url: path,
        baseURL:ApiConfig.API_URL,
        data: JSON.stringify(data),
        headers:{
            'Content-Type':'application/json',
        }
    }
    const rtr: { data: {token: string | undefined}} = await axios(refreshTokenRequestData);

    if(!rtr.data.token){
        return null;
    }

    return rtr.data.token;
}

async function repeatRequest(requestData: AxiosRequestConfig, resolve: (value: ApiResponse) => void){
    axios(requestData)
        .then(res=>{
            let response: ApiResponse;
            if(res.status===401){
                response = {
                    status: 'login',
                    data: null
                }
            } else {
                response = {
                    status: 'ok',
                    data: res
                }
            }

            return resolve(response);

        })
        .catch(err=>{//greska u komunikaciji
            const response: ApiResponse = {
                status: 'error',
                data: err
            }
            return resolve(response);
        })
}

