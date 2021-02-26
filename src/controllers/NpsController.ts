import { Request, Response } from "express";
import { getCustomRepository, Not, IsNull } from "typeorm";
import { SurveysUserRepository } from "../repositories/SurveysUsersRepository";


class NpsController {

    async execute(req: Request, res: Response) {

        const { survey_id } = req.params;

        const surveysUserRepository = getCustomRepository(SurveysUserRepository)

        const surveysUser = await surveysUserRepository.find({
            survey_id,
            value: Not(IsNull())
            
        })

        const detractor = surveysUser.filter(
            (Survey) => Survey.value >= 0 && Survey.value <= 6
        ).length;

        const promoters = surveysUser.filter(
            (Survey) => Survey.value >= 9 && Survey.value <= 10
        ).length;

        const  passive = surveysUser.filter(
            (Survey) => Survey.value >= 7 && Survey.value <= 8
        ).length;

        const totalAnswers = surveysUser.length;

        const calculate = (promoters - detractor) / totalAnswers * 100

        if (calculate >= 75 && calculate <= 100) {
            var nps = "Great"
        } else if (calculate >= 50 && calculate <= 74) {
            var nps = "Very good"
        } else if (calculate >= 10 && calculate <= 49) {
            var nps = "Reasonable"
        } else if (calculate >= 0 && calculate <= 9) {
            var nps = "Bad"
        } else {
            var nps = "Error"
        }
        
        return res.json({
            detractor,
            promoters,
            passive,
            totalAnswers,
            calculate,
            nps            
        })

    }
}

export { NpsController }