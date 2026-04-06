import prisma from "../config/prisma.js";


class teamRepo {
    async getTeam(teamId) {
        const team = await prisma.team.findUnique({ where: { id: teamId } });
        return team;
    }
}

export default new teamRepo();