import prisma from "../config/prisma.js";


class departmentRepo {
    async getDepartment(departmentId) {
        const department = await prisma.department.findUnique({ where: { id: departmentId } });
        return department;
    }
}

export default new departmentRepo();