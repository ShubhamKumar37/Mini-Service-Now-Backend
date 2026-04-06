import prisma from "../config/prisma.js";


class regionRepo {
    async getRegion(regionId) {
        const region = await prisma.region.findUnique({ where: { id: regionId } });
        return region;
    }
}

export default new regionRepo();