/**
 * The WallpaperController file is a very simple one, which does not need to be changed manually,
 * unless there's a case where business logic routes the request to an entity which is not
 * the service.
 * The heavy lifting of the Controller item is done in Request.js - that is where request
 * parameters are extracted and sent to the service, and where response is handled.
 */

import { OpenApiRequest } from 'express-openapi-validator/dist/framework/types'
import { Response } from 'express'

import Controller from './Controller'
import * as service from '../services/WallpaperService'
export const apiWallpaperVerticalGET = async (request: OpenApiRequest, response: Response) => {
    await Controller.handleRequest(request, response, service.apiWallpaperVerticalGET)
}

export const apiWallpaperWallpaperGET = async (request: OpenApiRequest, response: Response) => {
    await Controller.handleRequest(request, response, service.apiWallpaperWallpaperGET)
}
