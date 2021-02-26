import { EntityRepository, Repository } from "typeorm";
import { SurveyUser } from "../models/SurveysUser";

@EntityRepository(SurveyUser)
class SurveysUserRepository extends Repository<SurveyUser> {

}

export { SurveysUserRepository }