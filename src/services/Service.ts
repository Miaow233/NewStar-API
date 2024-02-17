//@ts-nocheck
export default class Service {
    static rejectResponse(error, code = 500) {
        return { error, code }
    }

    static successResponse(payload: any, code = 200) {
        return { payload, code }
    }
}
