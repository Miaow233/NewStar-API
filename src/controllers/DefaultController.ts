/**
 * The DefaultController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

import Controller from './Controller'
import * as service from '../services/DefaultService'
import { OpenApiRequest } from 'express-openapi-validator/dist/framework/types'
import { Response } from 'express'
export const apiHitokotoGET = async (request: OpenApiRequest, response: Response) => {
    await Controller.handleRequest(request, response, service.apiHitokotoGET)
}

export const apiImgholderGET = async (request: OpenApiRequest, response: Response) => {
    await Controller.handleRequest(request, response, service.apiImgholderGET)
}

export const apiIpGET = async (request: OpenApiRequest, response: Response) => {
    await Controller.handleRequest(request, response, service.apiIpGET)
}

export const apiPixelArtPOST = async (request: OpenApiRequest, response: Response) => {
    await Controller.handleRequest(request, response, service.apiPixelArtPOST)
}

export const apiPoisonousGET = async (request: OpenApiRequest, response: Response) => {
    await Controller.handleRequest(request, response, service.apiPoisonousGET)
}

export const apiQrcodeGET = async (request: OpenApiRequest, response: Response) => {
    await Controller.handleRequest(request, response, service.apiQrcodeGET)
}

export const apiTranslateGET = async (request: OpenApiRequest, response: Response) => {
    await Controller.handleRequest(request, response, service.apiTranslateGET)
}