import { ErrorResponse } from "../utils/index.js";
import { regionRepo } from "../repositories/index.js";


class regionService {
    async getRegion(data) {
        const { regionId } = data;
        const regionExist = await regionRepo.getRegion(regionId);
        if (!regionExist) throw new ErrorResponse(404, "Region not found");

        return regionExist;
    }
}

export default new regionService();