//@ts-nocheck
import fs from 'fs'
import path from 'path'
import camelCase from 'camelcase'
import config from '../config'
import { OpenApiRequest } from 'express-openapi-validator/dist/framework/types'
import { Response } from 'express'
import { Error } from '../types/error'

export default class Controller {
    static sendResponse(response: Response, payload: { code: number, payload: any }) {
        /**
         * 默认的响应代码是 200。
         * 在这种情况下，有效载荷将是一个由代码和有效载荷组成的对象。
         * 如果不是自定义的，则发送 200 和本方法收到的有效载荷。
         */
        response.status(payload.code || 200)
        const responsePayload = payload.payload !== undefined ? payload.payload : payload
        if(responsePayload instanceof Buffer) {
            response.end(responsePayload)
        } else if (responsePayload instanceof Object) {
            response.json(responsePayload)
        } else {
            response.end(responsePayload)
        }
    }

    static sendError(response: Response, error: Error) {
        response.status(error.code || 500)
        console.error(error.stack)
        if (error.error instanceof Object) {
            response.json(error.error)
        } else {
            response.end(error.error || error.message)
        }
    }

    /**
     * 文件已上传至 config.js 定义为上传目录的目录中
     * 文件有一个临时名称，保存为 request.files 数组中引用的文件对象的 "文件名"。
     * 该方法会找到文件并将其更改为上传文件时最初调用的文件名。
     * 为防止文件被覆盖，会在文件名和扩展名之间添加一个时间戳
     * @param request
     * @param fieldName
     * @returns {string}
     */
    static collectFile(request: OpenApiRequest, fieldName: string): string {
        let uploadedFileName = ''
        if (request.files && request.files instanceof Array && request.files.length > 0) {
            const fileObject = request.files.find((file: { fieldname: any }) => file.fieldname === fieldName)
            if (fileObject) {
                const fileArray = fileObject.originalname.split('.')
                const extension = fileArray.pop()
                fileArray.push(`_${Date.now()}`)
                uploadedFileName = `${fileArray.join('')}.${extension}`
                fs.renameSync(
                    path.join(config.FILE_UPLOAD_PATH, fileObject.filename),
                    path.join(config.FILE_UPLOAD_PATH, uploadedFileName)
                )
            }
        }
        return uploadedFileName
    }

    static getRequestBodyName(request: OpenApiRequest) {
        const codeGenDefinedBodyName = request.openapi.schema['x-codegen-request-body-name']
        if (codeGenDefinedBodyName !== undefined) {
            return codeGenDefinedBodyName
        }
        const refObjectPath = request.openapi.schema.requestBody.content['application/json'].schema.$ref
        if (refObjectPath !== undefined && refObjectPath.length > 0) {
            return refObjectPath.substr(refObjectPath.lastIndexOf('/') + 1)
        }
        return 'body'
    }

    static collectRequestParams(request: OpenApiRequest) {
        const requestParams = {}
        if (request.openapi.schema.requestBody != undefined) {
            const { content } = request.openapi.schema.requestBody
            if (content['application/json'] !== undefined) {
                const requestBodyName = camelCase(this.getRequestBodyName(request))
                requestParams[requestBodyName] = request.body
            } else if (content['multipart/form-data'] !== undefined) {
                Object.keys(content['multipart/form-data'].schema.properties).forEach((property) => {
                    const propertyObject = content['multipart/form-data'].schema.properties[property]
                    if (propertyObject.format !== undefined && propertyObject.format === 'binary') {
                        requestParams[property] = this.collectFile(request, property)
                    } else {
                        requestParams[property] = request.body[property]
                    }
                })
            }
        }

        request.openapi.schema.parameters.forEach((param) => {
            if (param.in === 'path') {
                requestParams[param.name] = request.openapi.pathParams[param.name]
            } else if (param.in === 'query') {
                requestParams[param.name] = request.query[param.name]
            } else if (param.in === 'header') {
                requestParams[param.name] = request.headers[param.name]
            }
        })
        requestParams['headers'] = request.headers
        return requestParams
    }

    static async handleRequest(
        request: OpenApiRequest,
        response: Response,
        serviceOperation: ({ }: any) => Promise<{ payload: any | object; code: number }>
    ) {
        try {
            const serviceResponse = await serviceOperation(this.collectRequestParams(request))
            Controller.sendResponse(response, serviceResponse)
        } catch (error: any) {
            Controller.sendError(response, error)
        }
    }
}

module.exports = Controller
