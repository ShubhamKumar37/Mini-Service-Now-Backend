import { ErrorResponse } from "../utils/index.js";
import { departmentRepo } from "../repositories/index.js";


class departmentService {
    async getDepartment(data) {
        const { departmentId } = data;
        const departmentExist = await departmentRepo.getDepartment(departmentId);
        if (!departmentExist) throw new ErrorResponse(404, "Department not found");

        return departmentExist;
    }
}

export default new departmentService();