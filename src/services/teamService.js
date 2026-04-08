import { ErrorResponse } from "../utils/index.js";
import { teamRepo } from "../repositories/index.js";


class teamService {
    async getTeam(data) {
        const { teamId } = data;
        const teamExist = await teamRepo.getTeam(teamId);
        if (!teamExist) throw new ErrorResponse(404, "Team not found");

        return teamExist;
    }
}

export default new teamService();