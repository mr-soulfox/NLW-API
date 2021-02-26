//pertence ao surveyUser

import { Request, Response } from "express"
import { getCustomRepository } from "typeorm"
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUserRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository"
import SendMailService from "../services/SendMailService";
import { resolve } from 'path';
import { AppError } from "../errors/AppError";

class SendMailController {

    async execute(req: Request, res: Response) {
        const { email, survey_id } = req.body

        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUserRepository = getCustomRepository(SurveysUserRepository);

        const user = await usersRepository.findOne({email})

        if (!user) {
            throw new AppError("User does not exist")
        }

        const survey = await surveysRepository.findOne({ id: survey_id })

        if (!survey) {
            throw new AppError("Survey does not exist")
        }
          
        
        const npsPath = resolve(__dirname, "..", "views", "mails", "npsMail.hbs");

        const surveyUserAlreadyExist = await surveysUserRepository.findOne({
            where: {user_id: user.id, value: null}, 
            relations: [
                "user", "survey"
            ]
        })

        const variables = {
            name: user.name,
            title: survey.title, 
            description: survey.description,
            id: "",
            link: process.env.URL_MAIL
        }   

        if(surveyUserAlreadyExist) {
            variables.id = surveyUserAlreadyExist.id;
            await SendMailService.execute(email, survey.title, variables, npsPath);
            return res.json(surveyUserAlreadyExist);
        }

        // Save information on table surveyUser 
        const surveyUser = surveysUserRepository.create({
            user_id: user.id,
            survey_id
        })
        await surveysUserRepository.save(surveyUser)

        //send email to user
        variables.id = surveyUser.id
        await SendMailService.execute(email, survey.title, variables, npsPath)

        return res.json(surveyUser)

    }
}

export { SendMailController }