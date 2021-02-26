import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysUserRepository } from "../repositories/SurveysUsersRepository";


class AnswerController {
    
    async execute(req: Request, res: Response) {
        const { value } = req.params;
        const { u } = req.query;

        const surveysUserRepository = getCustomRepository(SurveysUserRepository)

        const surveyUser = await surveysUserRepository.findOne({
            id: String(u),
        });

        if (!surveyUser) {
            throw new AppError("Survey User does not exist!")
        }

        surveyUser.value = Number(value);

        await surveysUserRepository.save(surveyUser)

        return res.json(surveyUser)
    }
}

export { AnswerController }