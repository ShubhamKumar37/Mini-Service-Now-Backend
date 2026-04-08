import { ErrorResponse } from "../utils/responses.js";

export const validate = (schema) => (req, res, next) => {
    const { erorr, value } = schema.validate(req.body);
    if (erorr) throw new ErrorResponse(400, erorr.details[0].message);
    req.body = value;
    next();
};