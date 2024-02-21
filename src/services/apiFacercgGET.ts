import Service from './Service';

/**
* 颜值评分
*
* returns Object
* */

export const apiFacercgGET = async () => {
    try {
        return Service.successResponse({});
    } catch (e: any) {
        throw Service.rejectResponse(e.message || 'Invalid input', e.status || 405);
    }
};
